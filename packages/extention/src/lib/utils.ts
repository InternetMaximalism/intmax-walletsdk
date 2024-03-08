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
	try {
		iframe?.contentWindow?.origin;
		await new Promise((resolve) => iframe?.addEventListener("load", resolve));
		await new Promise((resolve) => setTimeout(resolve, 100));
	} catch {}
};

export const normalizeChainId = (chainId: string | number) => {
	return `0x${Number(chainId).toString(16)}`;
};
