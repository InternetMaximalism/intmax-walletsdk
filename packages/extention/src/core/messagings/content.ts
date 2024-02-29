import { defineExtensionMessaging } from "@/lib/messaging/extensionMessaging";
import { SiteRequest } from "../types";

type ContentMessengerSchema = {
	request: (data: SiteRequest) => Promise<unknown>;
	event: (data: { event: string; data: unknown }) => void;
};

export const contentMessaging = defineExtensionMessaging<ContentMessengerSchema>("content");
