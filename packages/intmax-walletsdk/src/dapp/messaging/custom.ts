import { AbstractRequest, AbstractResponse } from "src";
import invariant from "../../utils/invariant";
import { withResolvers } from "../../utils/withResolvers";
import { DappClientOptions } from "../dappClient";
import { WalletClientRef } from "../messaging";

const WINDOW_WATCH_INTERVAL = 100;
const CLOSE_WAITING = 100;

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
		if (event.data.method === "intmax_ready" || event.data.method === "webmax_ready") {
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

const _incrementId = (ref: WalletClientRef) => {
	ref.id = ref.id ? ref.id + 1 : 1;
	return ref.id;
};

export const callRequest = async (
	ref: WalletClientRef,
	// biome-ignore lint/suspicious/noExplicitAny:
	opt: DappClientOptions<any, any>,
	message: Omit<AbstractRequest, "id">,
) => {
	const { window: windowOpt } = opt.wallet;
	invariant(windowOpt?.mode === "custom");
	const { promise, resolve } = withResolvers<void>();
	const waiting = Promise.allSettled(ref.calls || []);

	ref.calls = [...(ref.calls || []), promise];

	await waiting;

	if (windowOpt.window.closed) throw new Error("Window closed");
	ref.window = windowOpt.window;

	if (!ref.handshake) {
		const _handshake = {
			id: _incrementId(ref),
			namespace: "intmax",
			method: "intmax_ready",
			params: [],
		} satisfies AbstractRequest;
		ref.window.postMessage(_handshake, new URL(opt.wallet.url).origin);
	}

	const _message = { ...message, id: _incrementId(ref) };
	const result = await _callRequest(ref, opt, _message);

	ref.calls = ref.calls?.filter((p) => p !== promise);
	setTimeout(() => {
		if (ref.calls?.length !== 0 || result?.windowHandling !== "close") return;
		windowOpt.onClose?.();
	}, CLOSE_WAITING);

	resolve();

	return result;
};
