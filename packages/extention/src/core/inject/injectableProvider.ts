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

	return {
		isMetaMask: true,
		request,
		on: (event, cb) => emitter.on(event, cb),
		removeListener: (event, cb) => emitter.removeListener(event, cb),
		providers: undefined,
	} as EIP1193LikeProvider;
};
