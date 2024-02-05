import { create } from "zustand";

export type AccountState = {
	mnemonic: string | null;
	indexes: number[];
	current: number | null;
	setMnemonic: (mnemonic: string) => void;
	setIndexes: (cb: ((indexes: number[]) => number[]) | number[]) => void;
	setCurrent: (current: number) => void;
	reset: () => void;
};

const initialState = {
	mnemonic: null,
	indexes: [],
	current: null,
};

export const useAccountStore = create<AccountState>((set) => ({
	...initialState,
	setMnemonic: (mnemonic) => set({ mnemonic }),
	setIndexes: (cb) => set((state) => ({ indexes: typeof cb === "function" ? cb(state.indexes) : cb })),
	setCurrent: (current) => set({ current }),
	reset: () => set(initialState),
}));