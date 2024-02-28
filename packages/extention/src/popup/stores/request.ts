import { createStorageStore } from "@/lib/zustand";
import { pendingRequestsStorage } from "@/storage";

export const usePendingRequestStore = createStorageStore(
	{
		pendingRequests: pendingRequestsStorage,
	},
	(set) => ({}),
);
