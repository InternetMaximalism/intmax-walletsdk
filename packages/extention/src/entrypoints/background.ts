import { contentMessaging } from "@/core/messagings/content";
import { popupMessaging } from "@/core/messagings/popup";
import { RequestResult, SiteRequest, WebmaxWallet } from "@/core/types";
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
import { uuidv7 } from "uuidv7";
import { RpcProviderError, WALLET_APPROVAL_METHODS } from "walletnext/dapp";
import { browser } from "wxt/browser";
import { defineBackground } from "wxt/sandbox";

const openPopupWindow = async () => {
	const openingPopup = await openingPopupWindowStorage.getValue();
	if (openingPopup) {
		const existingTab = await browser.windows.get(openingPopup.tabId).catch(() => null);
		if (existingTab) return await browser.windows.update(openingPopup.tabId, { focused: true });
		await openingPopupWindowStorage.setValue(null);
	}

	const currentWindow = await browser.windows.getCurrent();
	const window = await browser.windows.create({
		url: browser.runtime.getURL("/popup.html"),
		type: "panel",
		height: POPUP_SIZE.height + 28,
		width: POPUP_SIZE.width,
		left: (currentWindow.left ?? 0) + (currentWindow.width ? currentWindow.width - currentWindow.width : 0),
		top: currentWindow.top ?? 0,
	});
	if (!window.id) throw new Error("No window id");
	await openingPopupWindowStorage.setValue({ tabId: window.id });
};

const closePopupWindow = async () => {
	const openingPopup = await openingPopupWindowStorage.getValue();
	if (!openingPopup) return;
	await browser.windows.remove(openingPopup.tabId);
	await openingPopupWindowStorage.setValue(null);
};

let walletRequestQueues: Promise<true>[] = [];

export default defineBackground(() => {
	const listeners: Map<string, (result: RequestResult) => Promise<void>> = new Map();
	const clients = new Map<number, HttpJsonRpcClient>();

	const walletRequest = async <T = unknown>(wallet: WebmaxWallet, data: SiteRequest, chainId?: string) => {
		console.log("Wallet Request", wallet, data, chainId);
		await Promise.all(walletRequestQueues);
		await openPopupWindow();

		const { promise, resolve } = withResolvers<true>();
		walletRequestQueues.push(promise);

		const { namespace, metadata, method, params } = data;
		const id = uuidv7();
		const request = { id, namespace, wallet, metadata, method, params, chainId };

		await pendingRequestStorage.setValue(request);

		const response = await new Promise<RequestResult<T>>((resolve) => {
			listeners.set(id, async (result) => resolve(result as RequestResult<T>));
		});

		await pendingRequestStorage.setValue(null);

		resolve(true);
		walletRequestQueues = walletRequestQueues.filter((p) => p !== promise);
		setTimeout(() => {
			if (walletRequestQueues.length === 0) closePopupWindow();
		}, 300);

		console.log("Wallet Request Response", response);

		if (response.error) throw new Error(String(response.error));
		return response.result as T;
	};

	const emitEvent = async (tabId: number, event: string, data: unknown) => {
		console.info("Emitting event", event, data, tabId);
		await contentMessaging.sendEvent("onEvent", { event, data }, tabId);
	};

	const getHttpRpcClient = async (chainId: number) => {
		const networks = await networksStorage.getValue();
		const network = networks?.find((n) => n.chainId === chainId);
		if (!network) throw new Error("No network found");

		if (!clients.has(chainId)) {
			const newClient = httpJsonRpcClient(network.httpRpcUrl);
			clients.set(chainId, newClient);
		}
		return clients.get(chainId) as HttpJsonRpcClient;
	};

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

	contentMessaging.onMessage("request", async ({ sender, data }) => {
		try {
			const { namespace, metadata, method, params } = data;

			const currentWallet = await currentWebmaxWalletStorage.getValue();
			if (!currentWallet) throw new Error("No wallet found");

			const walletMetadataList = await walletMetadataStorage.getValue();
			const walletMetadata = walletMetadataList?.find((w) => w.url === currentWallet.url);

			const sessions = await sessionsStorage.getValue();
			let session = sessions?.find((s) => s.wallet.url === currentWallet.url && s.host === metadata.host);

			if (!session) {
				session = {
					...{ wallet: currentWallet, host: metadata.host },
					...{ namespaces: [], chainIds: {}, accounts: {} },
				};
				await sessionsStorage.setValue([...(sessions ?? []), session]);
			}

			const _getChainId = async () => {
				if (session?.chainIds[namespace]) return session?.chainIds[namespace];
				const supportedEthChains = walletMetadata?.supportedChains.filter((c) => c.startsWith("eip155"));
				if (supportedEthChains) return Number(supportedEthChains[0].split(":")[1]);
				return 1;
			};

			const switchChain = async (chainId: number) => {
				if (!session) return;
				console.info("Switching chain", chainId);
				const newSession = { ...session, chainIds: { ...session.chainIds, [namespace]: chainId } };
				await sessionsStorage.setValue(sessions?.map((s) => (s === session ? newSession : s)));
				sender?.tab?.id && emitEvent(sender.tab.id, "chainChanged", normalizeChainId(chainId));
			};

			const updateAccounts = async (accounts: string[]) => {
				if (!session) return;
				const { accounts: oldAccounts } = session;
				const isChanged = oldAccounts?.eip155?.join(",") !== accounts.join(",");
				if (!isChanged) return;

				const newSession = { ...session, accounts: { ...session.accounts, eip155: accounts } };
				await sessionsStorage.setValue(sessions?.map((s) => (s === session ? newSession : s)));
				sender?.tab?.id && emitEvent(sender.tab.id, "accountsChanged", accounts);

				if (oldAccounts?.eip155?.length === 0 && accounts.length > 0)
					sender?.tab?.id && emitEvent(sender.tab.id, "connect", { chainId: normalizeChainId(await _getChainId()) });
			};

			if (method === "eth_chainId") return { result: normalizeChainId(await _getChainId()) };
			if (method === "eth_accounts") return { result: session.accounts?.eip155 ?? [] };
			if (method === "wallet_switchEthereumChain") {
				const [{ chainId: newChainId }] = params as [{ chainId: string }];
				await switchChain(Number(newChainId));
				return { result: null };
			}
			if (method === "eth_requestAccounts") {
				const result = await walletRequest<string[]>(currentWallet, data, normalizeChainId(await _getChainId()));
				await updateAccounts(result);
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
});
