import {
	AbstractMessageSchema,
	ChainedNamespace,
	DappHandleTypes,
	DappMetadata,
	DefaultMessageSchema,
	ExtractSchema,
	IntmaxConnectResult,
	SchemaNamespace,
} from "../types/protocol";
import { CUSTOM, IFRAME, POPUP, WalletClientRef } from "./messaging/index";
import { NamespaceProvider } from "./providers";
import { BaseStorage, createIntmaxDappStore, memoryStorage } from "./store";
import { throwOrResult } from "./utils";

export type DappClientOptions<
	Schema extends AbstractMessageSchema,
	Providers extends { [K in Schema[number]["namespace"]]?: NamespaceProvider<unknown, K> },
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

export type IntmaxDappClient<
	Schema extends AbstractMessageSchema,
	Providers extends { [K in Schema[number]["namespace"]]?: NamespaceProvider<unknown, K> },
> = {
	connect: () => Promise<IntmaxConnectResult>;
	provider: <NS extends Schema[number]["namespace"]>(
		namespace: ChainedNamespace<NS> | NS,
	) => Providers[NS] extends NamespaceProvider<infer T, NS> ? T : never;
};

export const intmaxDappClient = <
	Providers extends { [K in SchemaNamespace<Schema>]?: NamespaceProvider<unknown, K> },
	Schema extends AbstractMessageSchema = DefaultMessageSchema,
	_Schema extends AbstractMessageSchema = ExtractSchema<Schema, DappHandleTypes>,
>(
	opt: DappClientOptions<_Schema, Providers>,
): IntmaxDappClient<_Schema, Providers> => {
	let { storage = memoryStorage(), providers, wallet, metadata } = opt;

	const ref: WalletClientRef = {};
	const store = createIntmaxDappStore(storage);

	const callWallet = async <T>(
		namespace: Schema[number]["namespace"],
		args: { method: string; params?: unknown; chainId?: string },
	): Promise<T> => {
		const { method, params, chainId } = args;
		const chainedNamespace = chainId ? `${namespace}:${chainId}` : namespace;
		const message = { namespace: chainedNamespace, method, params, metadata } as const;
		const response =
			wallet.window?.mode === "custom"
				? CUSTOM.callRequest(ref, { wallet, metadata }, message)
				: wallet.window?.mode === "iframe"
				  ? IFRAME.callRequest(ref, { wallet, metadata }, message)
				  : POPUP.callRequest(ref, { wallet, metadata }, message);

		return throwOrResult(await response) as T;
	};

	return {
		connect: async () => {
			const result = await callWallet<IntmaxConnectResult>("intmax", { method: "intmax_connect", params: [] });
			await store.setState((state) => ({ ...state, ...result }));
			return result;
		},
		setMetadata: (metadata_: DappMetadata) => {
			metadata = metadata_;
		},
		setWallet: (wallet_: DappClientOptions<_Schema, Providers>["wallet"]) => {
			wallet = wallet_;
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
	} as IntmaxDappClient<_Schema, Providers>;
};
