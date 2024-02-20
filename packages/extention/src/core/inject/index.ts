import { EIP1193Provider, announceProvider } from "mipd";
import { createInjectableProvider } from "./injectableProvider";

declare global {
	interface Window {
		ethereum: EIP1193Provider;
		webmax_ext: EIP1193Provider;
	}
}

const shouldInject = () => {
	if (window.document.doctype?.name !== "html") return false;
	return true;
};

export const initWebmaxProvider = async () => {
	if (!shouldInject()) return;

	const provider = await createInjectableProvider();

	Object.assign(provider, {
		isMetaMask: true,
	});

	announceProvider({
		info: {
			icon: "https://webmax.io/favicon.ico",
			name: "Webmax",
			rdns: "io.webmax",
			uuid: crypto.randomUUID(),
		},
		provider,
	});

	Object.defineProperties(window, {
		ethereum: { value: provider, configurable: false },
		webmax_ext: { value: provider, configurable: false },
	});
};
