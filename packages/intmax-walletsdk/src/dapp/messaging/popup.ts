import { AbstractRequest, AbstractResponse } from "src";
import invariant from "../../utils/invariant";
import { withResolvers } from "../../utils/withResolvers";
import { DappClientOptions } from "../dappClient";
import { WalletClientRef } from "../messaging";

const DEFAULT_WALLET_WINDOW_HEIGHT = 600;
const DEFAULT_WALLET_WINDOW_WIDTH = 400;

const MESSAGE_INTERVAL = 1000;
const CLOSE_WAITING = 100;
const WINDOW_WATCH_INTERVAL = 100;

// biome-ignore lint/suspicious/noExplicitAny:
const openWindow = (opt: DappClientOptions<any, any>) => {
	const { url, name, window: windowOpt } = opt.wallet;
	invariant(!windowOpt?.mode || windowOpt?.mode !== "custom");
	const height = windowOpt?.height || DEFAULT_WALLET_WINDOW_HEIGHT;
	const width = windowOpt?.width || DEFAULT_WALLET_WINDOW_WIDTH;
	const [top, left] = [window.screenY, window.screenX + window.innerWidth - width];
	const win = window.open(url, name, `top=${top}px, left=${left}px, height=${height}px, width=${width}px`);
	if (!win) throw new Error("Failed to open window");
	return win;
};

const waitForClose = (ref: WalletClientRef) => {
	const { promise, resolve } = withResolvers<void>();
	const timer = setInterval(() => {
		if (!ref.window || ref.window.closed) {
			clearInterval(timer);
			resolve();
		}
	}, WINDOW_WATCH_INTERVAL);

	return promise;
};

// biome-ignore lint/suspicious/noExplicitAny:
const _callRequest = (ref: WalletClientRef, opt: DappClientOptions<any, any>, message: AbstractRequest) => {
	invariant(ref.window);
	const { promise, resolve } = withResolvers<AbstractResponse>();

	let sensed = false;
	const sendMessageOnce = () => {
		if (sensed) return;
		sensed = true;
		ref.window?.postMessage({ ...message, id: ref.id }, new URL(opt.wallet.url).origin);
	};

	ref.handshake && sendMessageOnce();
	const listener = (event: MessageEvent) => {
		if (event.source !== ref.window) return;
		if (event.data.method === "intmax_ready") {
			ref.handshake = event.data.result;
			sendMessageOnce();
		}
		if (event.data.id === message.id) {
			resolve(event.data);
			window.removeEventListener("message", listener);
		}
	};

	window.addEventListener("message", listener);

	const windowClosed = waitForClose(ref).then(() => ({
		...{ id: message.id, method: message.method, namespace: message.namespace },
		windowHandling: "close" as const,
		error: { code: -32000, message: "Window closed" },
	}));

	return Promise.race([promise, windowClosed]);
};

export const callRequest = async (
	ref: WalletClientRef,
	// biome-ignore lint/suspicious/noExplicitAny:
	opt: DappClientOptions<any, any>,
	message: Omit<AbstractRequest, "id">,
) => {
	const { promise, resolve } = withResolvers<void>();
	const waiting = Promise.allSettled(ref.calls || []);

	ref.id = ref.id ? ref.id + 1 : 1;
	ref.calls = [...(ref.calls || []), promise];

	await waiting;

	if (ref.window) await new Promise((r) => setTimeout(r, MESSAGE_INTERVAL));

	if (ref.window?.closed || !ref.window) ref.window = openWindow(opt);

	const _message = { ...message, id: ref.id };
	const result = await _callRequest(ref, opt, _message);

	ref.calls = ref.calls?.filter((p) => p !== promise);
	setTimeout(() => {
		if (ref.calls?.length !== 0 || result?.windowHandling !== "close") return;
		ref.window?.close();
		ref.window = undefined;
		ref.handshake = undefined;
	}, CLOSE_WAITING);

	resolve();

	return result;
};
