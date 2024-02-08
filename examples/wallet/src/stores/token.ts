import { Erc20Token } from "@/types";
import { create } from "zustand";
import { ArrayUpdater, applyUpdater } from "./utils";

export type TokensState = {
	tokens: Erc20Token[];
	setTokens: ArrayUpdater<Erc20Token>;
	reset: () => void;
};

const initialState = {
	tokens: [],
};

export const useTokensStore = create<TokensState>((set) => ({
	...initialState,
	setTokens: (cbOrTokens) => set((state) => ({ tokens: applyUpdater(cbOrTokens, state.tokens) })),
	reset: () => set(initialState),
}));
