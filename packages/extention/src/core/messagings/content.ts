import { defineExtensionMessaging } from "@/lib/messaging/extensionMessaging";
import { SiteRequest } from "../types";

type ContentMessengerSchema = {
	request: (data: SiteRequest) => unknown;
	event: (data: { event: string; data: unknown }) => void;
};

export const contentMessaging = defineExtensionMessaging<ContentMessengerSchema>("content");
