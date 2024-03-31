import { defineExtensionMessaging } from "@/lib/messaging/extensionMessaging";
import { RequestResult } from "../types";

type PopupMessengerSchema = {
	onResult: (data: RequestResult) => true;
	reloadPopup: (data: true) => true;
};

export const popupMessaging = defineExtensionMessaging<PopupMessengerSchema>("popup");
