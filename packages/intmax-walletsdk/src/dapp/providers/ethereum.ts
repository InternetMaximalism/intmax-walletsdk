import EventEmitter from "eventemitter3";
import { parseChainedNamespace } from "../../utils/parseChainedNamespace";
import { RpcProviderError } from "../errors";
import { _ethStoreWrapper } from "../store";
import { HttpJsonRpcClient, httpJsonRpcClient } from "../utils";
import { NamespaceProvider } from "./interface";

export const WALLET_APPROVAL_METHODS = [
	"eth_sign",
	"eth_sendTransaction",
	"eth_signTransaction",
	"eth_signTypedData_v4",
	"personal_sign",
	"wallet_addEthereumChain",
	"wallet_watchAsset",
];

export type EIP1193LikeProvider = {
	request: <TReturn = unknown>(args: { method: string; params?: unknown }) => Promise<TReturn>;
	on: (event: string, callback: (data: unknown) => void) => void;
	removeListener: (event: string, callback: (data: unknown) => void) => void;
};

export type EthereumProviderOptions = {
	lockChainId?: boolean;
	httpRpcUrls?: Record<number, string>;
};

export type EthereumProvider = NamespaceProvider<EIP1193LikeProvider, "eip155">;

export const ethereumProvider =
	(options?: EthereumProviderOptions): NamespaceProvider<EIP1193LikeProvider, "eip155"> =>
	({ store: _store, callWallet, namespace }) => {
		const store = _ethStoreWrapper(_store);
		const { chainId } = parseChainedNamespace(namespace);
		const emitter = new EventEmitter();
		const httpRpcClients: Map<number, HttpJsonRpcClient> = new Map();

		let currentChainId = store.getState().then((state) => {
			return Number(chainId ?? state.chainId ?? state.supportedChains[0] ?? "1");
		});

		const chainedCallWallet = async <T>(args: { method: string; params?: unknown }) => {
			const { method, params } = args;
			return callWallet<T>({ method, params, chainId: String(await currentChainId) });
		};

		const getHttpRpcClient = (chainId: number) => {
			if (!httpRpcClients.has(chainId)) {
				if (!options?.httpRpcUrls?.[chainId]) throw new RpcProviderError("HTTP RPC not provided for chain", 4001);
				const newClient = httpJsonRpcClient(options.httpRpcUrls[chainId]);
				httpRpcClients.set(chainId, newClient);
			}
			return httpRpcClients.get(chainId) as HttpJsonRpcClient;
		};

		const getChainId = async () => `0x${(await currentChainId).toString(16)}`;

		const switchChain = async (chainId: number) => {
			if (options?.lockChainId) throw new RpcProviderError("Chain ID is locked", 4001);
			currentChainId = Promise.resolve(chainId);
			await store.setState((state) => ({ ...state, chainId }));
			emitter.emit("chainChanged", chainId);
		};

		const updateAccounts = async (accounts: string[]) => {
			const { accounts: oldAccounts } = await store.getState();
			const isChanged = oldAccounts.join(",") !== accounts.join(",");
			if (!isChanged) return;
			await store.setState((state) => ({ ...state, accounts }));
			emitter.emit("accountsChanged", accounts);
			if (oldAccounts.length > 0) return;
			emitter.emit("connect", { chainId: getChainId() });
		};

		// biome-ignore lint/complexity/noExcessiveCognitiveComplexity:
		const request = async <TReturn = unknown>(args: { method: string; params?: unknown }) => {
			const { method, params } = args;
			if (method === "eth_chainId") return getChainId() as TReturn;
			if (method === "eth_accounts") return (await store.getState()).accounts as TReturn;
			if (method === "wallet_switchEthereumChain") {
				const [{ chainId: newChainId }] = params as [{ chainId: string }];
				await switchChain(Number(newChainId));
				return null as TReturn;
			}
			if (method === "eth_requestAccounts") {
				const existingAccounts = (await store.getState()).accounts;
				if (existingAccounts.length > 0) return existingAccounts as TReturn;
				const accounts = await chainedCallWallet<string[]>({ method: "eth_requestAccounts", params: [] });
				await updateAccounts(accounts);
				return accounts as TReturn;
			}
			if (WALLET_APPROVAL_METHODS.includes(method)) {
				const response = await chainedCallWallet<TReturn>({ method, params });
				emitter.emit("message", { type: "eth_subscription", data: response });
				return response;
			}

			const client = getHttpRpcClient(await currentChainId);
			const response = await client<TReturn>(method, params);
			return response;
		};

		return {
			request,
			on: (event, cb) => emitter.on(event, cb),
			removeListener: (event, cb) => emitter.removeListener(event, cb),
		} satisfies EIP1193LikeProvider;
	};
