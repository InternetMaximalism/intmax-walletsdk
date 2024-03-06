import EventEmitter from "eventemitter3";
import { EIP1193LikeProvider, RpcProviderError } from "walletnext/dapp";
import { inpageMessaging } from "../messagings/inpage";

export const createInjectableProvider = (): EIP1193LikeProvider => {
	const emitter = new EventEmitter();

	inpageMessaging.onEvent("onEvent", ({ data }) => {
		console.info("provider Received event", data.event, data.data);
		emitter.emit(data.event, data.data);
	});

	const request = async (args: { method: string; params?: unknown }) => {
		const { method, params } = args;
		console.info("provider Sending request", method, params);
		const response = await inpageMessaging.sendMessage("request", { namespace: "eip155", method, params });
		console.info("provider Received request", JSON.stringify(response).slice(0, 100));
		if (response.error) throw new RpcProviderError(response.error.message, response.error.code);
		return response.result;
	};

	return {
		request,
		on: (event, cb) => emitter.on(event, cb),
		removeListener: (event, cb) => emitter.removeListener(event, cb),
	} as EIP1193LikeProvider;
};
