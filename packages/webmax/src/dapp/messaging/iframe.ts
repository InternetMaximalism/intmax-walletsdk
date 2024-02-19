import { AbstractRequest, AbstractResponse } from "src";
import invariant from "../../utils/invariant";
import { withResolvers } from "../../utils/withResolvers";
import { WebmaxDappClientOptions } from "../dappClient";
import { WalletClientRef } from "./types";

const DEFAULT_WALLET_WINDOW_HEIGHT = 600;
const DEFAULT_WALLET_WINDOW_WIDTH = 400;

const IFRAME_ID = "webmax-dapp-iframe";
const IFRAME_STYLE = `
    position: fixed;
    top: 0;
    right: 0;
    border: none;
    display: block;
	z-index: 2147483647;
`;

// biome-ignore lint/suspicious/noExplicitAny:
const openIframe = (opt: WebmaxDappClientOptions<any, any>) => {
	const { url, name, window: windowOpt } = opt.wallet;
	invariant(!windowOpt?.mode || windowOpt?.mode !== "custom");

	const existingIframe = document.getElementById(IFRAME_ID);
	if (existingIframe) {
		const iframe = existingIframe as HTMLIFrameElement;
		return iframe;
	}

	const height = windowOpt?.height || DEFAULT_WALLET_WINDOW_HEIGHT;
	const width = windowOpt?.width || DEFAULT_WALLET_WINDOW_WIDTH;
	const iframe = document.createElement("iframe");
	iframe.style.cssText = IFRAME_STYLE;
	iframe.id = IFRAME_ID;
	iframe.src = url;
	iframe.name = name;
	iframe.height = height.toString();
	iframe.width = width.toString();
	document.body.appendChild(iframe);

	return iframe;
};

const showIframe = (ref: WalletClientRef) => {
	if (ref.iframe) ref.iframe.style.display = "block";
};

const hideIframe = (ref: WalletClientRef) => {
	if (ref.iframe) ref.iframe.style.display = "none";
};

// biome-ignore lint/suspicious/noExplicitAny:
const _callRequest = (ref: WalletClientRef, opt: WebmaxDappClientOptions<any, any>, message: AbstractRequest) => {
	invariant(ref.iframe?.contentWindow);
	const walletWindow = ref.iframe.contentWindow;
	const { promise, resolve } = withResolvers<AbstractResponse>();

	let sensed = false;
	const sendMessageOnce = () => {
		if (sensed) return;
		sensed = true;
		walletWindow?.postMessage({ ...message, id: ref.id }, new URL(opt.wallet.url).origin);
	};

	ref.handshake && sendMessageOnce();
	const listener = (event: MessageEvent) => {
		if (event.source !== walletWindow) return;
		if (event.data.method === "webmax_handshake") {
			ref.handshake = event.data.result;
			sendMessageOnce();
		}
		if (event.data.id === message.id) {
			resolve(event.data);
			window.removeEventListener("message", listener);
		}
	};

	window.addEventListener("message", listener);

	return promise;
};

export const callRequest = async (
	ref: WalletClientRef,
	// biome-ignore lint/suspicious/noExplicitAny:
	opt: WebmaxDappClientOptions<any, any>,
	message: Omit<AbstractRequest, "id">,
) => {
	const { promise, resolve } = withResolvers<void>();
	const waiting = Promise.allSettled(ref.calls || []);

	ref.id = ref.id ? ref.id + 1 : 1;
	ref.calls = [...(ref.calls || []), promise];

	await waiting;
	if (!ref.iframe) ref.iframe = openIframe(opt);
	showIframe(ref);

	const _message = { ...message, id: ref.id };
	const result = await _callRequest(ref, opt, _message);

	ref.calls = ref.calls?.filter((p) => p !== promise);
	if (result?.windowHandling === "close") hideIframe(ref);

	resolve();

	return result;
};
