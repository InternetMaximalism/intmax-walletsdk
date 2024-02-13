import { AbstractResponse } from "src";
import {
	AbstractMessageSchema,
	DappHandleTypes,
	DappMetadata,
	EthereumAddress,
	ExtractSchema,
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
	httpRpc?: Record<string, { url: string }>;
};

export type EIP1193Provider = {
	request: <TReturn = unknown>(args: { method: string; params?: unknown }) => Promise<TReturn>;
	on: (event: never, callback: (data: never) => void) => void;
};

type WalletState = WebmaxConnectResult;
export type WebmaxDappClient<Schema extends AbstractMessageSchema> = {
	connect: () => Promise<WebmaxConnectResult>;
	provider: <NS extends Schema[number]["namespace"]>(namespace: NS) => EIP1193Provider;
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

	const callHttp = async (namespace: string, method: string, params: unknown) => {
		const url = opt.httpRpc?.[namespace]?.url;
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
		provider: (namespace) => {
			if (namespace !== "eip155") throw new Error("Not implemented");

			const throwOrResult = (response: AbstractResponse) => {
				if ("error" in response) throw new RpcProviderError(response.error.message, response.error.code);
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
					if (method === "eth_accounts") {
						return state.accounts.eip155 as TReturn;
					}
					if (method === "eth_chainId") {
						const eip155Chains = state.supportedChains
							.filter((c) => c.split(":")[0] === "eip155")
							.map((c) => c.split(":")[1]);
						return eip155Chains[0] as TReturn;
					}
				}

				const response = await callHttp(namespace, method, params);
				return throwOrResult(response) as TReturn;
			};
			const on = () => {};
			return { request, on };
		},
	};
};
