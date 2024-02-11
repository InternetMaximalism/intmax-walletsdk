import {
	AbstractMessageSchema,
	EthereumAddress,
	Namespace,
	WebmaxDefaultMessageSchema,
	WebmaxHandshakeResult,
} from "../types/protocol";
import { WALLET_ACTION_METHODS, WALLET_READ_METHODS } from "./constants";
import { RpcProviderError } from "./errors";
import { WalletClientRef, callRequest, incrementId } from "./messaging";

type WalletState = WebmaxHandshakeResult;

export type WebmaxDappClientOptions = {
	url: string;
	name: string;
	window?: { width: number; height: number; mode?: "popup" };
	httpRpc?: Record<string, { url: string }>;
};

export type EIP1193Provider<Schema extends AbstractMessageSchema[]> = {
	request: (args: { method: string; params: unknown }) => void;
	on: (event: never, callback: (data: never) => void) => void;
};

export type WebmaxDappClient<Schema extends AbstractMessageSchema[]> = {
	connect: () => Promise<void>;
	provider: <NS extends Namespace>(namespace: NS) => EIP1193Provider<Schema>;
};

export const webmaxDappClient = <Schema extends AbstractMessageSchema[] = WebmaxDefaultMessageSchema>(
	opt: WebmaxDappClientOptions,
): WebmaxDappClient<Schema> => {
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
			const message = { namespace: "webmax", method: "webmax_connect", params: [] } as const;
			const response = await callRequest(ref, opt, message);
			if ("error" in response) throw new RpcProviderError(response.error.message, response.error.code);
			Object.assign(state, response.result);
		},
		provider: (namespace) => {
			if (namespace !== "eip155") throw new Error("Not implemented");
			// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This is a complex function
			const request = async (args: { method: string; params: unknown }) => {
				const { method, params } = args;
				if (WALLET_ACTION_METHODS.includes(`${namespace}/${method}`)) {
					const message = { namespace, method, params };
					const { windowHandling: _, namespace: __, ...response } = await callRequest(ref, opt, message);
					Object.assign(state, ref.handshake);
					if (method === "eth_requestAccounts" && "result" in response) {
						state.accounts.eip155 = response.result as EthereumAddress[];
					}
					return response;
				}

				if (WALLET_READ_METHODS.includes(method)) {
					if (method === "eth_accounts") return { id: incrementId(ref), result: state.accounts.eip155 };
					if (method === "eth_chainId") {
						const eip155Chains = state.supportedChains
							.filter((c) => c.split(":")[0] === "eip155")
							.map((c) => c.split(":")[1]);
						return { id: incrementId(ref), result: eip155Chains };
					}
				}

				const response = await callHttp(namespace, method, params);
				return { id: incrementId(ref), result: response.result };
			};
			const on = () => {
				throw new Error("Not implemented");
			};
			return { request, on };
		},
	};
};
