import { defineExtensionMessaging } from "@/lib/messaging/extensionMessaging";

type ContentMessengerSchema = {
	request: (data: {
		method: string;
		params?: unknown;
		metadata: { host: string; name: string; description: string; icons: string[] };
	}) => Promise<unknown>;
	event: (data: { event: string; data: unknown }) => void;
};

export const contentMessaging = defineExtensionMessaging<ContentMessengerSchema>("content");
