import { EIP1193Provider, announceProvider } from "mipd";
import { ethereumProvider, webmaxDappClient } from "webmax2/dapp";
import { browser } from "wxt/browser";
import { defineContentScript } from "wxt/sandbox";

declare global {
	interface Window {
		ethereum: EIP1193Provider;
		webmax_ext: EIP1193Provider;
	}
}

const WALLET_URL = "http://localhost:5173";

const shouldInject = () => {
	if (window.document.doctype?.name !== "html") return false;
	return true;
};

const getPageMetadata = () => {
	const title = document.title;
	const description = document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
	const icons = Array.from(document.querySelectorAll('link[rel="icon"]'))
		.map((el) => el.getAttribute("href"))
		.filter((href): href is NonNullable<typeof href> => href !== null)
		.map((href) => new URL(href, location.href).href);

	return { name: title, description, icons };
};

export default defineContentScript({
	matches: ["<all_urls>"],
	main: async (args) => {
		console.info("Hello webmax", { id: browser.runtime.id });
		if (!shouldInject()) return;

		const client = webmaxDappClient({
			wallet: { name: "webmax", url: WALLET_URL },
			metadata: getPageMetadata(),
			providers: {
				eip155: ethereumProvider({
					httpRpcUrls: {
						1: "https://mainnet.infura.io/v3",
						5: "https://goerli.infura.io/v3",
						10: "https://mainnet.optimism.io",
						137: "https://rpc-mainnet.maticvigil.com/",
					},
				}),
			},
		});

		const provider = await client.provider("eip155");

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
		});
	},
});
