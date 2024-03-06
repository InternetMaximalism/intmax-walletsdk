import { uuidv7 } from "uuidv7";

// biome-ignore lint/suspicious/noExplicitAny:
export const defineInpageMessaging = <T extends Record<string, any> = Record<string, any>>(messagingId: string) => {
	return {
		async sendMessage<K extends keyof T>(method: K, data: Parameters<T[K]>[0]): Promise<ReturnType<T[K]>> {
			return new Promise((resolve, reject) => {
				const id = uuidv7();

				const listener = (message: MessageEvent) => {
					const { messagingId: responseMessagingId, id: responseId, result, error } = message.data;
					if (responseMessagingId === messagingId && responseId === id && (result || error)) {
						window.removeEventListener("message", listener);
						if (error) reject(new Error(error));
						else resolve(result);
					}
				};
				window.addEventListener("message", listener);
				window.postMessage({ messagingId, id, method, data }, "*");
			});
		},
		async sendEvent<K extends keyof T>(event: K, data: Parameters<T[K]>[0]): Promise<void> {
			window.postMessage({ messagingId, event, data }, "*");
		},
		async onMessage<K extends keyof T>(
			method: K,
			cb: (args: { data: Parameters<T[K]>[0] }) => ReturnType<T[K]> | Promise<ReturnType<T[K]>>,
		): Promise<void> {
			const listener = (message: MessageEvent) => {
				const { messagingId: responseMessagingId, method: responseMethod, data } = message.data;
				if (responseMessagingId === messagingId && responseMethod === method) {
					const result = cb({ data });
					Promise.resolve(result)
						.then((result) => window.postMessage({ messagingId, id: message.data.id, result }, "*"))
						.catch((error) => window.postMessage({ messagingId, id: message.data.id, error: error.message }, "*"));
				}
			};
			window.addEventListener("message", listener);
		},
		async onEvent<K extends keyof T>(event: K, cb: (data: { data: Parameters<T[K]>[0] }) => void): Promise<void> {
			const listener = (message: MessageEvent) => {
				const { messagingId: responseMessagingId, event: responseEvent, data } = message.data;
				if (responseMessagingId === messagingId && responseEvent === event) cb({ data });
			};
			window.addEventListener("message", listener);
		},
	};
};
