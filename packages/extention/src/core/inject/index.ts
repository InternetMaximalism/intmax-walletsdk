import { WEBMAX_WALLET_UUID, WEMAX_WALLET_LOGO } from "@/constants";
import { EIP1193Provider, announceProvider } from "mipd";
import { createInjectableProvider } from "./injectableProvider";

declare global {
	interface Window {
		ethereum: EIP1193Provider & { providers: EIP1193Provider[] };
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
	const providers = window.ethereum?.providers ? [...window.ethereum.providers, provider] : [provider];
	Object.defineProperties(provider, {
		providers: { value: providers, configurable: true },
	});

	announceProvider({
		info: {
			icon: WEMAX_WALLET_LOGO,
			name: "INTMAX Wallet",
			rdns: "io.intmax-walletsdk",
			uuid: WEBMAX_WALLET_UUID,
		},
		provider,
	});

	try {
		Object.defineProperties(window, {
			ethereum: { value: provider, configurable: false },
			intmax: { value: provider, configurable: false },
		});
	} catch (e) {
		// @ts-ignore - this is a hack to avoid the error
		window.ethereum = provider;
	}

	// @ts-ignore
	window.web3 = { currentProvider: provider };

	window.dispatchEvent(new Event("ethereum#initialized"));
};
