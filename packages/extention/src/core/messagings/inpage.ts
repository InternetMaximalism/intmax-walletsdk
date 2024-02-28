import { defineInpageMessaging } from "@/lib/messaging/inpageMessaging";

type InpageMessengerSchema = {
	request: (data: { method: string; params?: unknown }) => Promise<unknown>;
	event: (data: { event: string; data: unknown }) => void;
};

export const inpageMessaging = defineInpageMessaging<InpageMessengerSchema>("webmax-extension-inpage");
