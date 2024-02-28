import { contentMessaging } from "@/core/messagings/content";
import { popupMessaging } from "@/core/messagings/popup";
import { RequestResult } from "@/core/types";
import { currentWebmaxWalletStorage, pendingRequestsStorage } from "@/storage";
import { uuidv7 } from "uuidv7";
import { defineBackground } from "wxt/sandbox";

export default defineBackground(() => {
	const listeners: Map<string, (result: RequestResult) => Promise<void>> = new Map();
	popupMessaging.onMessage("onResult", async ({ data }) => {
		try {
			console.info("Background Received result", data);
			const { id, result } = data;
			if (!listeners.has(id)) return true as const;
			await listeners.get(id)?.({ id, result });
			listeners.delete(id);

			return true as const;
		} catch (e) {
			console.error(e);
			throw e;
		}
	});

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
			await pendingRequestsStorage.setValue([request]);
			console.info("Pending requests", await pendingRequestsStorage.getValue());

			const result = await new Promise<RequestResult>((resolve) => {
				listeners.set(id, async (result) => {
					resolve(result);
					return;
				});
			});
			console.info("Background Sending result", result);

			await pendingRequestsStorage.setValue(existing.filter((r) => r.id !== id));
			return result;
		} catch (e) {
			console.error(e);
		}
	});
});
