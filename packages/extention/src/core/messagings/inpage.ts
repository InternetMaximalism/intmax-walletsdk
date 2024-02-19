import { defineWindowMessaging } from "@webext-core/messaging/page";

export interface InpageMessengerSchema {
	request: (data: { method: string; params?: unknown }) => Promise<unknown>;
	event: (data: { event: string; data: unknown }) => void;
}

export const inpageMessaging = defineWindowMessaging<InpageMessengerSchema>({
	namespace: "webmax-extension-inpage",
});
