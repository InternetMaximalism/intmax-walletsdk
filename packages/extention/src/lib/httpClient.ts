import { AbstractResponse } from "intmax-walletsdk";
import { RpcProviderError } from "intmax-walletsdk/dapp";

export const throwOrResult = (response: AbstractResponse) => {
	if ("error" in response) {
		console.error(response.error);
		throw new RpcProviderError(response.error.message, response.error.code);
	}
	return response.result;
};

export type HttpJsonRpcClient = <TReturn = unknown>(method: string, params: unknown) => Promise<TReturn>;

export const httpJsonRpcClient = (url: string) => {
	let id = 0;

	return <TReturn = unknown>(method: string, params: unknown): Promise<TReturn> => {
		const currentId = id++;
		return fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ jsonrpc: "2.0", id: currentId, method, params }),
		})
			.then((response) => response.json())
			.then(throwOrResult) as Promise<TReturn>;
	};
};
