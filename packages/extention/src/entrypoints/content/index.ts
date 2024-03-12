import { contentMessaging } from "@/core/messagings/content";
import { inpageMessaging } from "@/core/messagings/inpage";
import { browser } from "wxt/browser";
import { defineContentScript } from "wxt/sandbox";

export default defineContentScript({
	matches: ["<all_urls>"],
	main: async () => {
		console.error("Content script is running");
		inpageMessaging.onMessage("request", ({ data }) => {
			console.info("Content script received request", data.method, data.params);
			return contentMessaging.sendMessage("request", data);
		});
		contentMessaging.onEvent("onEvent", ({ data }) => inpageMessaging.sendEvent("onEvent", data));

		if (navigator.userAgent.toLowerCase().includes("firefox")) {
			const container = document.head || document.documentElement;
			const script = document.createElement("script");
			script.src = browser.runtime.getURL("/inpage.js");
			container.insertBefore(script, container.children[0]);
			container.removeChild(script);
		}
	},
});
