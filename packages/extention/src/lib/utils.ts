import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const withResolvers = <T = void, E = unknown>() => {
	let resolve: (value: T) => void = () => {};
	let reject: (reason?: E) => void = () => {};
	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});
	return { promise, resolve, reject };
};

export const waitIframeWindowReady = async (iframe: HTMLIFrameElement) => {
	const contentWindow = iframe.contentWindow;
	if (!contentWindow) throw new Error("Iframe content window is not ready");

	try {
		contentWindow?.origin;
		await new Promise((resolve) => iframe?.addEventListener("load", resolve));
		return contentWindow as Window;
	} catch {
		return contentWindow as Window;
	}
};

export const normalizeChainId = (chainId: string | number) => {
	return `0x${Number(chainId).toString(16)}`;
};
