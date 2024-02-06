import { create } from "zustand";

export type SettingsState = {
	testnetmode: boolean;
	whitelisted: boolean;
	setTestnetmode: (testnetmode: boolean) => void;
	setWhitelisted: (whitelisted: boolean) => void;
	reset: () => void;
};

const initialState = {
	testnetmode: false,
	whitelisted: true,
};

export const useSettingsStore = create<SettingsState>((set) => ({
	...initialState,
	setTestnetmode: (testnetmode) => set({ testnetmode }),
	setWhitelisted: (whitelisted) => set({ whitelisted }),
	reset: () => set(initialState),
}));
