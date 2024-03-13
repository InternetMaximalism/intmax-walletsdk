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

	const provider = createInjectableProvider();

	//console.log("before", window.ethereum, window.ethereum?.providers);

	Object.defineProperties(window, {
		ethereum: { value: provider, configurable: false },
		walletnext: { value: provider, configurable: false },
	});

	//console.log("after", window.ethereum, window.ethereum?.providers);

	announceProvider({
		info: {
			icon: "https://webmax.io/favicon.ico",
			name: "Webmax",
			rdns: "io.webmax",
			uuid: crypto.randomUUID(),
		},
		provider,
	});

	window.dispatchEvent(new Event("ethereum#initialized"));
};
