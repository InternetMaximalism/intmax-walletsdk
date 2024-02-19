import EventEmitter from "eventemitter3";
import { EIP1193LikeProvider } from "webmax2/dapp";
import { inpageMessaging } from "../messagings/inpage";

export const createInjectableProvider = (): EIP1193LikeProvider => {
	const emitter = new EventEmitter();

	inpageMessaging.onMessage("event", ({ data }) => {
		emitter.emit(data.event, data.data);
	});

	const request = async (args: { method: string; params?: unknown }) => {
		const response = await inpageMessaging.sendMessage("request", args);
		console.info("Received response", response);
		return response;
	};

	return {
		request,
		on: (event, cb) => emitter.on(event, cb),
		removeListener: (event, cb) => emitter.removeListener(event, cb),
	} as EIP1193LikeProvider;
};
