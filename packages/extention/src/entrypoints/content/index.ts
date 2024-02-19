import { inpageMessaging } from "@/core/messagings/inpage";
import { ethereumProvider, webmaxDappClient } from "webmax2/dapp";
import { Windows, browser } from "wxt/browser";
import { createIntegratedUi } from "wxt/client";
import { defineContentScript } from "wxt/sandbox";

const WALLET_URL = "http://localhost:5173";

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

	main: async (ctx) => {
		const ui = createIntegratedUi(ctx, {
			position: "inline",
			onMount: (container) => {
				const script = document.createElement("script");
				script.src = browser.runtime.getURL("/inpage.js");
				container.appendChild(script);
			},
		});

		ui.mount();

		inpageMessaging.onMessage("request", async ({ data }) => {});

		const events = ["accountsChanged", "chainChanged", "networkChanged", "disconnect", "connect"];
		for (const event of events) {
		}
	},
});
