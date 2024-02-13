import type { AbstractRequest, AbstractResponse, ClientMode } from "../types/messaging";

export const parentWindow = (): Window | null => {
	if (typeof window === "undefined") return null;
	if (window.opener && window.opener !== window) return window.opener as Window;
	if (window.parent && window.parent !== window) return window.parent;
	return null;
};

export const checkClientMode = (): ClientMode | null => {
	if (typeof window === "undefined") return null;
	if (window.opener && window.opener !== window) return "popup";
	if (window.parent && window.parent !== window) return "iframe";
	return null;
};

export const sendMessage = (message: AbstractResponse) => {
	const parent = parentWindow();
	if (!parent) return;
	parent.postMessage(message, "*");
};

export const onMessage = (callback: (event: AbstractRequest, origin: string) => void) => {
	const parent = parentWindow();
	if (!parent || typeof window === "undefined") return () => {};
	const listener = (event: MessageEvent) => {
		if (event.source !== parentWindow()) return;
		window.focus();
		callback(event.data, event.origin);
	};
	window.addEventListener("message", listener);
	return () => window.removeEventListener("message", listener);
};
