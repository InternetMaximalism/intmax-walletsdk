import { Network } from "@/core/types";
import { createStorageStore } from "@/lib/zustand";
import { networksStorage } from "@/storage";

export const useNetworksStore = createStorageStore({ networks: networksStorage }, (set) => ({
	setNetworks: (networks: Network[]) => set({ networks }),
}));
