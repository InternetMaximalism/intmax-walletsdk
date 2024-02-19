import { getSiteMetadata } from "@/core/libs/getSiteMetadata";
import { contentMessaging } from "@/core/messagings/content";
import { inpageMessaging } from "@/core/messagings/inpage";
import { browser } from "wxt/browser";
import { createIntegratedUi } from "wxt/client";
import { defineContentScript } from "wxt/sandbox";

export default defineContentScript({
	matches: ["<all_urls>"],

	main: async (ctx) => {
		console.info("Content script is running");
		inpageMessaging.onMessage("request", async ({ data }) => {
			console.info("Received request -content", data);
			const metadata = getSiteMetadata();
			const response = await contentMessaging.sendMessage("request", { ...data, metadata });
			return response;
		});

		contentMessaging.onMessage("event", async ({ data }) => {
			const { event: eventName, data: eventData } = data;
			inpageMessaging.sendMessage("event", { event: eventName, data: eventData });
		});

		const ui = createIntegratedUi(ctx, {
			position: "inline",
			onMount: (container) => {
				const script = document.createElement("script");
				script.src = browser.runtime.getURL("/inpage.js");
				container.appendChild(script);
			},
		});

		ui.mount();
	},
});
