import { defineExtensionMessaging } from "@webext-core/messaging";
import { RequestResult } from "../types";

type PopupMessengerSchema = {
	onResult: (data: RequestResult) => true;
};

export const popupMessaging = defineExtensionMessaging<PopupMessengerSchema>();
