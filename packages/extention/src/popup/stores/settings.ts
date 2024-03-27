import { createStorageStore } from "@/lib/zustand";
import { popupSettingsStorage } from "@/storage";

export const useSettingsStore = createStorageStore({ settings: popupSettingsStorage }, (set) => ({
	setTestMode: (isTestMode: boolean) => set((state) => ({ settings: { ...state.settings, isTestMode } })),
}));
