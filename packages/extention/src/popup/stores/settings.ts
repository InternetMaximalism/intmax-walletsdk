import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SettingsState = {
	isTestMode: boolean;
	theme: "light" | "dark" | "system";
};

export type SettingsActions = {
	setTestMode: (isTestMode: boolean) => void;
	setTheme: (theme: "light" | "dark" | "system") => void;
};

export const useSettingsStore = create(
	persist<SettingsState & SettingsActions>(
		(set) => ({
			isTestMode: false,
			theme: "system",
			setTestMode: (isTestMode: boolean) => set({ isTestMode }),
			setTheme: (theme: "light" | "dark" | "system") => set({ theme }),
		}),
		{ name: "settings" },
	),
);
