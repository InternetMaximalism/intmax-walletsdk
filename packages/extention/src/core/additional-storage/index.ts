import { storage } from "wxt/storage";

export type AdditionalStorageSchema = [
	{
		type: "additional-storage-get";
		request: { key: string };
		response: { success: boolean; value: string };
	},
	{
		type: "additional-storage-set";
		request: { key: string; value: string };
		response: { success: boolean };
	},
	{
		type: "additional-storage-remove";
		request: { key: string };
		response: { success: boolean };
	},
];

export type AdditionalStorageRequest<
	T extends { type: string; request: unknown; response: unknown }[] = AdditionalStorageSchema,
> = {
	[K in keyof T]: {
		id: string;
		type: T[K]["type"];
		data: T[K]["request"];
	};
}[number];

export const handleAdditionalStorageRequest = async (event: MessageEvent) => {
	const request = event.data as AdditionalStorageRequest;
	const baseResponse = { id: request.id, type: request.type, namespace: "beta" };
	try {
		if (!(request?.type && request?.data)) return;
		if (request.type === "additional-storage-get") {
			const value = await storage.getItem(`local:/${event.origin}.${request.data.key}/`);
			return { ...baseResponse, data: { success: true, value } };
		}
		if (request.type === "additional-storage-set") {
			await storage.setItem(`local:/${event.origin}.${request.data.key}/`, request.data.value);
			return { ...baseResponse, data: { success: true } };
		}
		if (request.type === "additional-storage-remove") {
			await storage.removeItem(`local:/${event.origin}.${request.data.key}/`);
			return { ...baseResponse, data: { success: true } };
		}
	} catch (e) {
		console.error("handleAdditionalStorageRequest error", e);
		return { ...baseResponse, data: { success: false } };
	}
};
