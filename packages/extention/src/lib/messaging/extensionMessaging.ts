import { Runtime } from "wxt/browser";

// biome-ignore lint/suspicious/noExplicitAny:
export const defineExtensionMessaging = <T extends Record<string, any> = Record<string, any>>(messagingId: string) => {
	return {
		async sendMessage<K extends keyof T>(
			method: K,
			data: Parameters<T[K]>[0],
			tabId?: number,
		): Promise<ReturnType<T[K]>> {
			const response = tabId
				? await chrome.tabs.sendMessage(tabId, { messagingId, method, data })
				: await chrome.runtime.sendMessage({ messagingId, method, data });
			if (response.error) throw new Error(response.error);
			return response.result;
		},
		async sendEvent<K extends keyof T>(event: K, data: Parameters<T[K]>[0], tabId?: number): Promise<void> {
			if (tabId) await chrome.tabs.sendMessage(tabId, { messagingId, event, data });
			else await chrome.runtime.sendMessage({ messagingId, event, data });
		},
		async onMessage<K extends keyof T>(
			method: K,
			listener: (args: { sender: Runtime.MessageSender; data: Parameters<T[K]>[0] }) =>
				| ReturnType<T[K]>
				| Promise<ReturnType<T[K]>>,
		): Promise<void> {
			chrome.runtime.onMessage.addListener(
				(message, sender, sendResponse: (response: { result?: ReturnType<T[K]>; error?: string }) => void) => {
					if (message.messagingId === messagingId && message.method === method) {
						Promise.resolve(listener({ sender: sender as Runtime.MessageSender, data: message.data }))
							.then((response) => sendResponse({ result: response }))
							.catch((error) => sendResponse({ error: error.message }));
						// Keeping the message channel open for asynchronous response
					}
					return true;
				},
			);
		},
		async onEvent<K extends keyof T>(
			event: K,
			listener: (args: { sender: Runtime.MessageSender; data: Parameters<T[K]>[0] }) => void,
		): Promise<void> {
			chrome.runtime.onMessage.addListener((message, _sender) => {
				if (message.messagingId === messagingId && message.event === event) {
					listener({ sender: _sender as Runtime.MessageSender, data: message.data });
				}
			});
		},
	};
};
