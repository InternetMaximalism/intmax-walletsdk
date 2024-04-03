import { isEqNetwork } from "@/core/lib/network";
import { contentMessaging } from "@/core/messagings/content";
import { popupMessaging } from "@/core/messagings/popup";
import { RequestResult, Session, SiteRequest, WebmaxWallet } from "@/core/types";
import { HttpJsonRpcClient, httpJsonRpcClient } from "@/lib/httpClient";
import { normalizeChainId } from "@/lib/utils";
import { withResolvers } from "@/lib/utils";
import { POPUP_SIZE } from "@/popup/constants";
import {
	currentWebmaxWalletStorage,
	networksStorage,
	openingPopupWindowStorage,
	pendingRequestStorage,
	sessionsStorage,
	walletMetadataStorage,
} from "@/storage";
import { RpcProviderError, WALLET_APPROVAL_METHODS } from "intmax-walletsdk/dapp";
import { uuidv7 } from "uuidv7";
import { browser } from "wxt/browser";

const openPopupWindow = async () => {
	const openingPopup = await openingPopupWindowStorage.getValue();
	if (openingPopup) {
		const existingTab = await browser.windows.get(openingPopup.tabId).catch(() => null);
		if (existingTab) {
			await browser.windows.update(openingPopup.tabId, { focused: true });
			return existingTab;
		}
		await openingPopupWindowStorage.setValue(null);
	}

	const currentWindow = await browser.windows.getCurrent();
	const popup = await browser.windows.create({
		url: browser.runtime.getURL("/popup.html?create=true"),
		type: "panel",
		height: POPUP_SIZE.height + 28,
		width: POPUP_SIZE.width,
		left:
			(currentWindow.width ? (currentWindow.left ?? 0) + currentWindow.width : window.screen.availWidth) -
			POPUP_SIZE.width,
		top: (currentWindow.top ?? 0) + 100,
	});
	if (!popup.id) throw new Error("No window id");
	await openingPopupWindowStorage.setValue({ tabId: popup.id });
	return popup;
};

const closePopupWindow = async () => {
	const openingPopup = await openingPopupWindowStorage.getValue();
	if (!openingPopup) return;
	await browser.windows.remove(openingPopup.tabId);
	await openingPopupWindowStorage.setValue(null);
	await popupMessaging.sendEvent("reloadPopup", true);
};

const clients = new Map<number, HttpJsonRpcClient>();
const listeners: Map<string, (result: RequestResult) => Promise<void>> = new Map();
const walletRequestQueues: Map<string, Promise<true>[]> = new Map();

const getHttpRpcClient = async (chainId: number) => {
	const networks = await networksStorage.getValue();
	const network = networks?.find((n) => isEqNetwork(n, { namespace: "eip155", chainId }));
	if (!network) throw new Error("No network found");

	if (!clients.has(chainId)) {
		console.info("Creating new client", network.httpRpcUrl);
		const newClient = httpJsonRpcClient(network.httpRpcUrl);
		clients.set(chainId, newClient);
	}
	return clients.get(chainId) as HttpJsonRpcClient;
};

const walletRequest = async <T = unknown>(wallet: WebmaxWallet, data: SiteRequest, chainId?: string) => {
	const { promise, resolve } = withResolvers<true>();

	const next = async () => {
		const existing = walletRequestQueues.get(wallet.url);
		walletRequestQueues.set(wallet.url, existing?.filter((p) => p !== promise) ?? []);

		const pendingRequest = await pendingRequestStorage.getValue();
		const { [wallet.url]: _, ...rest } = pendingRequest;
		await pendingRequestStorage.setValue(rest);
		resolve(true);

		setTimeout(() => {
			if (walletRequestQueues.get(wallet.url)?.length === 0) closePopupWindow();
		}, 300);
	};

	try {
		const wating = Promise.all(walletRequestQueues.get(wallet.url) ?? []);
		if (!walletRequestQueues.has(wallet.url)) walletRequestQueues.set(wallet.url, []);
		walletRequestQueues.get(wallet.url)?.push(promise);
		await wating;

		const window = await openPopupWindow();

		const { namespace, metadata, method, params } = data;
		const id = uuidv7();
		const request = { id, namespace, wallet, metadata, method, params, chainId };

		const existingRequest = await pendingRequestStorage.getValue();
		await pendingRequestStorage.setValue({ ...existingRequest, [wallet.url]: request });

		const response = await new Promise<RequestResult<T>>((resolve, reject) => {
			listeners.set(id, async (result) => resolve(result as RequestResult<T>));
			browser.windows.onRemoved.addListener((tabId) => {
				if (tabId !== window.id) return;
				reject(new RpcProviderError("User closed the window", 4900));
			});
		});

		const pendingRequest = await pendingRequestStorage.getValue();
		const { [wallet.url]: _, ...rest } = pendingRequest;
		await pendingRequestStorage.setValue(rest);

		await next();

		if (response.error) throw new RpcProviderError(response.error.message, response.error.code);
		return response.result as T;
	} catch (e) {
		await next();
		const error = e as RpcProviderError;
		if ("code" in error && "message" in error) throw error;
		throw new RpcProviderError(String(e), 500);
	}
};

const emitEvent = async (tabId: number, event: string, data: unknown) => {
	console.info("Emitting event", event, data, tabId);
	await contentMessaging.sendEvent("onEvent", { event, data }, tabId);
};

const ethRequestAccountsCache: Map<string, string[]> = new Map();

export const startHandleRequest = () => {
	currentWebmaxWalletStorage.watch(async (wallet) => {
		const tabs = await browser.tabs.query({ active: true });
		for (const tab of tabs) {
			if (!tab.id) continue;
			emitEvent(tab.id, "disconnect", { error: { message: "Wallet switched", code: 4900 } });
			const sessions = await sessionsStorage.getValue();
			const session = sessions?.find((s) => s.wallet.url === wallet?.url);
			if (!session) return;
			await new Promise((resolve) => setTimeout(resolve, 200));
			emitEvent(tab.id, "connect", { chainId: normalizeChainId(session.chainIds.eip155) });
			emitEvent(tab.id, "accountsChanged", session.accounts.eip155);
			emitEvent(tab.id, "chainChanged", normalizeChainId(session.chainIds.eip155));
		}
	});

	popupMessaging.onMessage("onResult", async ({ data }) => {
		try {
			console.info("Background Received result", data);
			const { id, result } = data;
			if (!listeners.has(id)) return true as const;
			await listeners.get(id)?.({ id, result });
			listeners.delete(id);

			return true as const;
		} catch (e) {
			console.error(e);
			throw e;
		}
	});

	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: main logic
	contentMessaging.onMessage("request", async ({ sender, data }) => {
		try {
			const { namespace, metadata, method, params } = data;

			const currentWallet = await currentWebmaxWalletStorage.getValue();
			if (!currentWallet) throw new Error("No wallet found");

			const getSession = async () => {
				const sessions = await sessionsStorage.getValue();
				let session = sessions?.find((s) => s.wallet.url === currentWallet.url && s.host === metadata.host);

				if (!session) {
					session = {
						...{ wallet: currentWallet, host: metadata.host },
						...{ namespaces: [], chainIds: {}, accounts: {} },
					};
					await sessionsStorage.setValue([...(sessions ?? []), session]);
				}

				return session;
			};

			const updateSession = async (session: Session) => {
				const sessions = await sessionsStorage.getValue();
				await sessionsStorage.setValue(
					sessions?.map((s) => (s.host === session.host && s.wallet.url === session.wallet.url ? session : s)) ?? [],
				);
			};

			const _getChainId = async () => {
				const session = await getSession();
				if (session?.chainIds[namespace]) return session?.chainIds[namespace];
				return 1;
			};

			const switchChain = async (chainId: number) => {
				const session = await getSession();
				if (!session) return;
				console.info("Switching chain", chainId);
				const newSession = { ...session, chainIds: { ...session.chainIds, [namespace]: chainId } };
				await updateSession(newSession);
				sender?.tab?.id && emitEvent(sender.tab.id, "chainChanged", normalizeChainId(chainId));
			};

			const updateAccounts = async (accounts: string[]) => {
				const session = await getSession();
				if (!session) return;
				const { accounts: oldAccounts } = session;
				const isChanged = oldAccounts?.eip155?.join(",") !== accounts.join(",");
				console.info("Accounts changed", isChanged, oldAccounts?.eip155, accounts);
				if (!isChanged) return;

				const newSession = { ...session, accounts: { ...session.accounts, eip155: accounts } };
				await updateSession(newSession);
				sender?.tab?.id && emitEvent(sender.tab.id, "accountsChanged", accounts);

				if (oldAccounts?.eip155?.length === 0 && accounts.length > 0)
					sender?.tab?.id && emitEvent(sender.tab.id, "connect", { chainId: normalizeChainId(await _getChainId()) });
			};

			if (method === "eth_chainId") return { result: normalizeChainId(await _getChainId()) };
			if (method === "eth_accounts") return { result: (await getSession()).accounts?.eip155 ?? [] };
			if (method === "wallet_switchEthereumChain") {
				const [{ chainId: newChainId }] = params as [{ chainId: string }];
				await switchChain(Number(newChainId));
				return { result: null };
			}
			if (method === "eth_requestAccounts") {
				const cacheKey = `${sender.tab?.id}-${currentWallet.url}`;
				if (sender.tab?.id && ethRequestAccountsCache.has(cacheKey))
					return { result: ethRequestAccountsCache.get(cacheKey) };
				const result = await walletRequest<string[]>(currentWallet, data, normalizeChainId(await _getChainId()));
				await updateAccounts(result);
				ethRequestAccountsCache.set(cacheKey, result);
				return { result };
			}
			if (WALLET_APPROVAL_METHODS.includes(method)) {
				const result = await walletRequest(currentWallet, data, normalizeChainId(await _getChainId()));
				return { result };
			}

			const chainId = await _getChainId();
			console.info("ChainId", chainId);
			const client = await getHttpRpcClient(chainId);
			const response = await client(method, params);
			return { result: response };
		} catch (e) {
			const error = e as RpcProviderError;
			if ("code" in error && "message" in error) return { error: { message: error.message, code: error.code } };
			return { error: { message: String(e), code: 500 } };
		}
	});
};
