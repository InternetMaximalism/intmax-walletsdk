import { createStorageStore } from "@/lib/zustand";
import { pendingRequestStorage } from "@/storage";

export const useRequestStore = createStorageStore({ pendingRequest: pendingRequestStorage }, () => ({}));
