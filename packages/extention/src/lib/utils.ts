import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const waitIframeWindowReady = async (iframe: HTMLIFrameElement) => {
	try {
		iframe?.contentWindow?.origin;
		await new Promise((resolve) => iframe?.addEventListener("load", resolve));
		await new Promise((resolve) => setTimeout(resolve, 100));
	} catch {}
};
