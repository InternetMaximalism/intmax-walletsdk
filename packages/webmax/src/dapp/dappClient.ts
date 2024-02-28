import {
	AbstractMessageSchema,
	ChainedNamespace,
	DappHandleTypes,
	DappMetadata,
	ExtractSchema,
	SchemaNamespace,
	WebmaxConnectResult,
	WebmaxDefaultMessageSchema,
} from "../types/protocol";
import { CUSTOM, IFRAME, POPUP, WalletClientRef } from "./messaging/index";
import { WebmaxProvider } from "./providers";
import { BaseStorage, createWebmaxStore, memoryStorage } from "./store";
import { throwOrResult } from "./utils";

export type WebmaxDappClientOptions<
	Schema extends AbstractMessageSchema,
	Providers extends { [K in Schema[number]["namespace"]]?: WebmaxProvider<unknown, K> },
> = {
	wallet: {
		url: string;
		name: string;
		window?:
			| { width?: number; height?: number; mode?: "popup" | "iframe" }
			| { window: Window; onClose: () => void; mode: "custom" };
	};
	metadata: DappMetadata;
	providers?: Providers;
	storage?: BaseStorage;
};

export type WebmaxDappClient<
	Schema extends AbstractMessageSchema,
	Providers extends { [K in Schema[number]["namespace"]]?: WebmaxProvider<unknown, K> },
> = {
	connect: () => Promise<WebmaxConnectResult>;
	provider: <NS extends Schema[number]["namespace"]>(
		namespace: ChainedNamespace<NS> | NS,
	) => Providers[NS] extends WebmaxProvider<infer T, NS> ? T : never;
};

export const webmaxDappClient = <
	Providers extends { [K in SchemaNamespace<Schema>]?: WebmaxProvider<unknown, K> },
	Schema extends AbstractMessageSchema = WebmaxDefaultMessageSchema,
	_Schema extends AbstractMessageSchema = ExtractSchema<Schema, DappHandleTypes>,
>(
	opt: WebmaxDappClientOptions<_Schema, Providers>,
): WebmaxDappClient<_Schema, Providers> => {
	const { storage = memoryStorage(), providers } = opt;

	const ref: WalletClientRef = {};
	const store = createWebmaxStore(storage);

	const callWallet = async <T>(
		namespace: Schema[number]["namespace"],
		args: { method: string; params?: unknown; chainId?: string },
	): Promise<T> => {
		const { method, params, chainId } = args;
		const chainedNamespace = chainId ? `${namespace}:${chainId}` : namespace;
		const message = { namespace: chainedNamespace, method, params, metadata: opt.metadata } as const;
		const response =
			opt.wallet.window?.mode === "custom"
				? CUSTOM.callRequest(ref, { wallet: opt.wallet, metadata: opt.metadata }, message)
				: opt.wallet.window?.mode === "iframe"
				  ? IFRAME.callRequest(ref, { wallet: opt.wallet, metadata: opt.metadata }, message)
				  : POPUP.callRequest(ref, { wallet: opt.wallet, metadata: opt.metadata }, message);

		return throwOrResult(await response) as T;
	};

	return {
		connect: async () => {
			const result = await callWallet<WebmaxConnectResult>("webmax", { method: "webmax_connect", params: [] });
			await store.setState((state) => ({ ...state, ...result }));
			return result;
		},
		provider: <NS extends Schema[number]["namespace"]>(namespace: ChainedNamespace<NS> | NS) => {
			const [ns] = namespace.split(":") as [NS];
			const provider = providers?.[ns];
			if (!provider) throw new Error(`Provider for namespace "${ns}" not found`);

			return provider({
				namespace: namespace,
				callWallet: (args) => callWallet(ns, args),
				store: store,
			});
		},
	} as WebmaxDappClient<_Schema, Providers>;
};
