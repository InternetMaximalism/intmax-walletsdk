import { contentMessaging } from "@/core/messagings/content";
import { defineBackground } from "wxt/sandbox";

export default defineBackground(() => {
	contentMessaging.onMessage("request", async ({ data }) => {
		console.info("Received request", data);
	});
});
