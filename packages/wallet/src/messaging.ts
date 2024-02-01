import type { ClientMode } from "./types";

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

export const sendMessage = (message: unknown) => {
	const parent = parentWindow();
	if (!parent) return;
	parent.postMessage(message, parent.location.origin);
};

export const onMessage = (callback: (message: unknown) => void) => {
	// biome-ignore lint/nursery/noEmptyBlockStatements: for consistency
	if (typeof window === "undefined") return () => {};
	const listener = (event: MessageEvent) => {
		if (event.source !== parentWindow()) return;
		callback(event.data);
	};
	window.addEventListener("message", listener);
	return () => window.removeEventListener("message", listener);
};
