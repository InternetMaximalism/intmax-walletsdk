import { defineInpageMessaging } from "@/lib/messaging/inpageMessaging";
import { SiteRequest } from "../types";

type InpageMessengerSchema = {
	request: (data: Omit<SiteRequest, "metadata">) => Promise<unknown>;
	event: (data: { event: string; data: unknown }) => void;
};

export const inpageMessaging = defineInpageMessaging<InpageMessengerSchema>("webmax-extension-inpage");
