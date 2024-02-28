import { contentMessaging } from "@/core/messagings/content";
import { currentWebmaxWalletStorage, pendingRequestsStorage } from "@/storage";
import { uuidv7 } from "uuidv7";
import { defineBackground } from "wxt/sandbox";

export default defineBackground(() => {
	contentMessaging.onMessage("request", async ({ sender, data }) => {
		try {
			console.info("Background Received request", data);
			const { metadata, method, params } = data;

			const currentWallet = await currentWebmaxWalletStorage.getValue();
			if (!currentWallet) return console.error("No current wallet");

			const id = uuidv7();
			const request = { id, wallet: currentWallet, metadata, method, params };
			console.info("New request", request);
			const existing = await pendingRequestsStorage.getValue();
			console.info("Existing requests", existing);
			await pendingRequestsStorage.setValue([request]);
			console.info("Pending requests", await pendingRequestsStorage.getValue());
		} catch (e) {
			console.error(e);
		}
	});
});
