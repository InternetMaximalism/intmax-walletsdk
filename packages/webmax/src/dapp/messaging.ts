import { AbstractRequest, AbstractResponse, WebmaxHandshakeResult } from "src";
import invariant from "../utils/invariant";
import { withResolvers } from "../utils/withResolvers";
import { WebmaxDappClientOptions } from "./dappClient";

const DEFAULT_WALLET_WINDOW_HEIGHT = 600;
const DEFAULT_WALLET_WINDOW_WIDTH = 400;

export type WalletClientRef = {
	window?: Window;
	id?: number;
	calls?: Promise<unknown>[];
	handshake?: WebmaxHandshakeResult;
};

const openWindow = (opt: WebmaxDappClientOptions) => {
	const { url, name, window: windowOpt } = opt;
	const height = windowOpt?.height || DEFAULT_WALLET_WINDOW_HEIGHT;
	const width = windowOpt?.width || DEFAULT_WALLET_WINDOW_WIDTH;
	const [top, left] = [window.screenY, window.screenX + window.innerWidth - width];
	const win = window.open(url, name, `top=${top}px, left=${left}px, height=${height}px, width=${width}px`);
	if (!win) throw new Error("Failed to open window");
	return win;
};

const _callRequest = (ref: WalletClientRef, opt: WebmaxDappClientOptions, message: AbstractRequest) => {
	invariant(ref.window);
	const { promise, resolve } = withResolvers<AbstractResponse>();

	let sensed = false;
	const sendMessageOnce = () => {
		if (sensed) return;
		sensed = true;
		ref.window?.postMessage({ ...message, id: ref.id }, new URL(opt.url).origin);
	};

	ref.handshake && sendMessageOnce();
	const listener = (event: MessageEvent) => {
		//console.log("event", event);
		if (event.source !== ref.window) return;
		if (event.data.method === "webmax_handshake") {
			console.log("handshake", event.data.result);
			ref.handshake = event.data.result;
			sendMessageOnce();
			//window.postMessage({ ...message, id: ref.id }, event.origin);
		}
		if (event.data.id === message.id) {
			console.log("event.data", event.data);
			resolve(event.data);
			window.removeEventListener("message", listener);
		}
	};

	window.addEventListener("message", listener);
	return promise;
};

export const incrementId = (ref: WalletClientRef) => {
	ref.id = ref.id ? ref.id + 1 : 1;
	return ref.id;
};

export const callRequest = async (
	ref: WalletClientRef,
	opt: WebmaxDappClientOptions,
	message: Omit<AbstractRequest, "id">,
) => {
	const { promise, resolve } = withResolvers<void>();
	const waiting = Promise.allSettled(ref.calls || []);
	ref.id = ref.id ? ref.id + 1 : 1;
	ref.calls = [...(ref.calls || []), promise];

	await waiting;

	if (ref.window?.closed || !ref.window) ref.window = openWindow(opt);

	const _message = { ...message, id: ref.id };
	const result = await _callRequest(ref, opt, _message);

	ref.calls = ref.calls?.filter((p) => p !== promise);
	if (ref.calls?.length === 0 && result?.windowHandling === "close") {
		ref.window?.close();
		ref.window = undefined;
	}
	resolve();

	return result;
};
