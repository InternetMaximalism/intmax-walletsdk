import { Address, Hex } from "viem";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ArrayUpdater, applyUpdater } from "./utils";

export type AccountState = {
	mnemonic: string | null;
	indexes: number[];
	current: Address | null;
	viewAddresses: Address[];
	privateKeys: Hex[];
	setMnemonic: (mnemonic: string) => void;
	setIndexes: ArrayUpdater<number>;
	setCurrent: (current: Address) => void;
	setViewAddresses: ArrayUpdater<Address>;
	setPrivateKeys: ArrayUpdater<Hex>;
	reset: () => void;
};

const initialState = {
	mnemonic: null,
	indexes: [0],
	current: null,
	viewAddresses: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"] as Address[],
	privateKeys: [],
};

export const useAccountStore = create(
	persist<AccountState>(
		(set) => ({
			...initialState,
			setMnemonic: (mnemonic) => set({ mnemonic }),
			setIndexes: (cb) => set((state) => ({ indexes: applyUpdater(cb, state.indexes) })),
			setCurrent: (current) => set({ current }),
			setViewAddresses: (cb) => set((state) => ({ viewAddresses: applyUpdater(cb, state.viewAddresses) })),
			setPrivateKeys: (cb) => set((state) => ({ privateKeys: applyUpdater(cb, state.privateKeys) })),
			reset: () => set(initialState),
		}),
		{
			name: "account",
		},
	),
);
