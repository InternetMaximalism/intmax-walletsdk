import { AbstractResponse } from "src";
import {
	AbstractMessageSchema,
	ChainedNamespace,
	DappHandleTypes,
	DappMetadata,
	EthereumAddress,
	ExtractSchema,
	SchemaNamespace,
	WebmaxConnectResult,
	WebmaxDefaultMessageSchema,
} from "../types/protocol";
import { WALLET_ACTION_METHODS, WALLET_READ_METHODS } from "./constants";
import { RpcProviderError } from "./errors";
import { WalletClientRef, callRequest } from "./messaging";

export type WebmaxDappClientOptions = {
	wallet: {
		url: string;
		name: string;
		window?: { width: number; height: number; mode?: "popup" };
	};
	metadata: DappMetadata;
	httpRpc?: Record<ChainedNamespace, { url: string }>;
};

export type EIP1193Provider = {
	request: <TReturn = unknown>(args: { method: string; params?: unknown }) => Promise<TReturn>;
	on: (event: never, callback: (data: never) => void) => void;
};

type WalletState = WebmaxConnectResult;
export type WebmaxDappClient<Schema extends AbstractMessageSchema> = {
	connect: () => Promise<WebmaxConnectResult>;
	provider: <NS extends Schema[number]["namespace"]>(
		namespace: ChainedNamespace<NS> | NS,
		opt?: { lockChainId?: boolean },
	) => EIP1193Provider;
};

export const webmaxDappClient = <
	TSchema extends AbstractMessageSchema = WebmaxDefaultMessageSchema,
	_TSchema extends AbstractMessageSchema = ExtractSchema<TSchema, DappHandleTypes>,
>(
	opt: WebmaxDappClientOptions,
): WebmaxDappClient<_TSchema> => {
	const ref: WalletClientRef = {};
	const state: WalletState = {
		supportedNamespaces: [],
		supportedChains: [],
		accounts: {} as WalletState["accounts"],
	};

	const callHttp = async (namespace: string, chainId: string, method: string, params: unknown) => {
		const url = opt.httpRpc?.[`${namespace}:${chainId}`]?.url;
		if (!url) throw new Error("No HTTP RPC URL");
		const response = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
		});
		const json = await response.json();
		return json;
	};

	return {
		connect: async () => {
			const message = { namespace: "webmax", method: "webmax_connect", params: [], metadata: opt.metadata } as const;
			const response = await callRequest(ref, opt, message);
			if ("error" in response) throw new RpcProviderError(response.error.message, response.error.code);
			Object.assign(state, response.result);
			return response.result as WebmaxConnectResult;
		},
		provider: (chainedNamespace, providerOpt?: { lockChainId?: boolean }) => {
			const [namespace, defaultChain] = chainedNamespace.split(":") as [SchemaNamespace<_TSchema>, string];
			if (namespace !== "eip155") throw new Error("Not implemented");

			let chainId =
				defaultChain ?? state.supportedChains.map((c) => c.split(":")).find((c) => c[0] === "eip155")?.[1] ?? "1";

			const throwOrResult = (response: AbstractResponse) => {
				if ("error" in response) {
					console.error(response.error);
					throw new RpcProviderError(response.error.message, response.error.code);
				}
				return response.result;
			};

			// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This is a complex function
			const request = async <TReturn = unknown>(args: { method: string; params?: unknown }): Promise<TReturn> => {
				const { method, params } = args;
				if (WALLET_ACTION_METHODS.includes(`${namespace}/${method}`)) {
					const message = { namespace, method, params, metadata: opt.metadata };
					const response = await callRequest(ref, opt, message);
					Object.assign(state, ref.handshake);
					if (method === "eth_requestAccounts" && "result" in response) {
						state.accounts.eip155 = response.result as EthereumAddress[];
					}

					return throwOrResult(response) as TReturn;
				}

				if (WALLET_READ_METHODS.includes(`${namespace}/${method}`)) {
					if (method === "eth_accounts") return state.accounts.eip155 as TReturn;
					if (method === "eth_chainId") return chainId as unknown as TReturn;
					if (method === "wallet_switchEthereumChain") {
						if (providerOpt?.lockChainId) throw new RpcProviderError("Chain ID is locked", 4001);
						chainId = String(params);
						return null as TReturn;
					}
				}

				const response = await callHttp(namespace, chainId, method, params);
				return throwOrResult(response) as TReturn;
			};
			const on = () => {};
			return { request, on };
		},
	};
};
