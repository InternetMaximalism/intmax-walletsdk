import { Erc20Token } from "@/types";
import { create } from "zustand";

export type TokensState = {
	tokens: Erc20Token[];
	setTokens: (cbOrTokens: Erc20Token[] | ((tokens: Erc20Token[]) => Erc20Token[])) => void;
	reset: () => void;
};

const initialState = {
	tokens: [],
};

export const useTokensStore = create<TokensState>((set) => ({
	...initialState,
	setTokens: (cbOrTokens) =>
		set((state) => ({ tokens: typeof cbOrTokens === "function" ? cbOrTokens(state.tokens) : cbOrTokens })),
	reset: () => set(initialState),
}));
