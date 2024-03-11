import { getSiteMetadata } from "@/core/lib/getSiteMetadata";
import { contentMessaging } from "@/core/messagings/content";
import { inpageMessaging } from "@/core/messagings/inpage";
import { browser } from "wxt/browser";
import { defineContentScript } from "wxt/sandbox";

export default defineContentScript({
	matches: ["<all_urls>"],
	runAt: "document_start",
	main: async () => {
		console.info("Content script is running");
		inpageMessaging.onMessage("request", async ({ data }) => {
			try {
				console.info("Content Received request", data);
				const metadata = getSiteMetadata();
				const response = await contentMessaging.sendMessage("request", { ...data, metadata });
				//	console.info("Content Sending result", response);
				return response;
			} catch (e) {
				console.error(e);
				throw e;
			}
		});

		contentMessaging.onEvent("onEvent", async ({ data }) => {
			const { event: eventName, data: eventData } = data;
			console.log("Content Received event", eventName, eventData);
			inpageMessaging.sendEvent("onEvent", { event: eventName, data: eventData });
		});

		if (navigator.userAgent.toLowerCase().includes("firefox")) {
			const container = document.head || document.documentElement;
			const script = document.createElement("script");
			script.src = browser.runtime.getURL("/inpage.js");
			container.insertBefore(script, container.children[0]);
			container.removeChild(script);
		}
	},
});
