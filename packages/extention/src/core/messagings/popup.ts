import { defineExtensionMessaging } from "@/lib/messaging/extensionMessaging";
import { RequestResult } from "../types";

type PopupMessengerSchema = {
	onResult: (data: RequestResult) => true;
};

export const popupMessaging = defineExtensionMessaging<PopupMessengerSchema>("popup");
