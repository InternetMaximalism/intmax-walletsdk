import { fetchTokenPrice, fetchTokenPriceHistory } from "@/lib/blockchain/token";
import { tokenKey } from "@/lib/blockchain/utils";
import { Amount, AmountWithPrice, Token } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Account } from "viem";
import { useBalances } from "./balance";

export const useTokenPriceHistory = (token: Token, scale: "1d" | "7d" | "30d") => {
	const history = useQuery({
		queryKey: ["token-price-history", tokenKey(token), scale],
		queryFn: () => fetchTokenPriceHistory({ token, scale }),
	});

	return history;
};

// TODO: Refactor
export const useTokenBalanceWithPrice = (account: Account, token: Token) => {
	const balances = useBalances(account);
	const balance = balances.find((b) => tokenKey(b.token) === tokenKey(token));

	return balance ?? null;
};

export const useTokenPrice = (token: Token | null) => {
	const price = useQuery({
		queryKey: ["token-price", tokenKey(token)],
		queryFn: () => token && fetchTokenPrice(token),
		enabled: !!token,
	});

	return price;
};

export const useTokenAmountWithPrice = (amount: Amount | null): AmountWithPrice | null => {
	const price = useTokenPrice(amount?.token ?? null);

	if (!amount) return null;

	return {
		...amount,
		priceUsd: price.data ?? 0,
	};
};
