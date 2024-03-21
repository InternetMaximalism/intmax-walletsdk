import { defineInpageMessaging } from "@/lib/messaging/inpageMessaging";
import { SiteRequest } from "../types";

type InpageMessengerSchema = {
	request: (data: SiteRequest) => { result?: unknown; error?: { code: number; message: string } };
	onEvent: (data: { event: string; data: unknown }) => void;
	onReady: (data: true) => void;
};

export const inpageMessaging = defineInpageMessaging<InpageMessengerSchema>("webmax-extension-inpage");
