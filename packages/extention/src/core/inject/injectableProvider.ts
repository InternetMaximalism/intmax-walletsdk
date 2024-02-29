import EventEmitter from "eventemitter3";
import { EIP1193LikeProvider } from "walletnext/dapp";
import { inpageMessaging } from "../messagings/inpage";

export const createInjectableProvider = (): EIP1193LikeProvider => {
	const emitter = new EventEmitter();

	inpageMessaging.onMessage("event", ({ data }) => {
		emitter.emit(data.event, data.data);
	});

	const request = async (args: { method: string; params?: unknown }) => {
		const { method, params } = args;
		console.info("provider Received request", method, params);
		const response = await inpageMessaging.sendMessage("request", { namespace: "eip155", method, params });
		console.info("provider Received response", response);
		return response;
	};

	return {
		request,
		on: (event, cb) => emitter.on(event, cb),
		removeListener: (event, cb) => emitter.removeListener(event, cb),
	} as EIP1193LikeProvider;
};
