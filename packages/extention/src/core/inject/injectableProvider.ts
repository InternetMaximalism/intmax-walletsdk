import { withResolvers } from "@/lib/utils";
import EventEmitter from "eventemitter3";
import { EIP1193LikeProvider, RpcProviderError } from "intmax-walletsdk/dapp";
import { getSiteMetadata } from "../lib/getSiteMetadata";
import { inpageMessaging } from "../messagings/inpage";

export const createInjectableProvider = (): EIP1193LikeProvider => {
	const emitter = new EventEmitter();
	const { promise: waitForReady, resolve } = withResolvers<true>();

	inpageMessaging.onEvent("onReady", () => resolve(true));
	inpageMessaging.onEvent("onEvent", ({ data }) => emitter.emit(data.event, data.data));

	const request = async (args: { method: string; params?: unknown }) => {
		await waitForReady;
		const { method, params } = args;
		const metadata = await getSiteMetadata();
		const response = await inpageMessaging.sendMessage("request", { metadata, namespace: "eip155", method, params });

		if (response.error) throw new RpcProviderError(response.error.message, response.error.code);
		return response.result;
	};

	const enable = () => request({ method: "eth_requestAccounts" });
	const send = (methodOrPayload: unknown, paramsOrCb: unknown) => {
		if (typeof methodOrPayload === "string") return request({ method: methodOrPayload, params: paramsOrCb });
		return request(methodOrPayload as { method: string; params: unknown }).then(
			paramsOrCb as (result: unknown) => void,
		);
	};
	const sendAsync = async (payload: unknown, cb: (error: unknown, result: unknown) => void) => {
		const { method, params, ...rest } = payload as { method: string; params: unknown };
		try {
			const result = await request({ method, params });
			cb(null, { ...rest, method, result });
		} catch (e) {
			const error = e as Error;
			cb(error, { ...rest, method, error });
		}
	};

	return {
		isMetaMask: true,
		request,
		enable,
		send,
		sendAsync,
		on: (event, cb) => emitter.on(event, cb),
		removeListener: (event, cb) => emitter.removeListener(event, cb),
		providers: undefined,
	} as EIP1193LikeProvider;
};
