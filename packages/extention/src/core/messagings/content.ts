import { defineExtensionMessaging } from "@/lib/messaging/extensionMessaging";
import { SiteRequest } from "../types";

type ContentMessengerSchema = {
	request: (data: SiteRequest) => { result?: unknown; error?: { code: number; message: string } };
	onEvent: (data: { event: string; data: unknown }) => void;
};

export const contentMessaging = defineExtensionMessaging<ContentMessengerSchema>("content");
