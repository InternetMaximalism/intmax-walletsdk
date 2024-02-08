import { fetchAnkrBalanceWithPrice, fetchTokenBalance } from "@/lib/blockchain/balance";
import { tokenKey } from "@/lib/blockchain/utils";
import { lightKey, uniq } from "@/lib/utils";
import { useNetworksStore } from "@/stores/network";
import { useSettingsStore } from "@/stores/settings";
import { useTokensStore } from "@/stores/token";
import { Token } from "@/types";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Account } from "viem";

export const useAnkrBalances = (account: Account | null) => {
	const chains = useNetworksStore((state) => state.networks);
	const testnetmode = useSettingsStore((state) => state.testnetmode);
	const whitelisted = useSettingsStore((state) => state.whitelisted);

	const results = useQuery({
		queryKey: ["ankrBalance", account?.address, lightKey(chains, "id"), testnetmode, whitelisted],
		queryFn: async () => {
			if (!account) return [];
			const filteredChains = chains.filter((chain) => !!chain.testnet === !!testnetmode);
			return fetchAnkrBalanceWithPrice({ account, chains: filteredChains, whitelist: whitelisted });
		},
	});

	return results.data ?? [];
};

export const useTokenBalances = (account: Account | null, tokens: Token[]) => {
	const chains = useNetworksStore((state) => state.networks);

	const results = useQueries({
		queries: tokens.map((token) => ({
			queryKey: ["tokenBalance", account?.address, token],
			initialData: { token, balance: 0n, priceUsd: 0 },
			queryFn: () => {
				const chain = chains.find((chain) => chain.id === token.chainId);
				if (!(chain && account)) return { token, balance: 0n, priceUsd: 0 };
				return fetchTokenBalance({ account, token, chain });
			},
		})),
	});

	return results.map((result) => result.data).filter((data): data is NonNullable<typeof data> => !!data);
};

export const useBalances = (account: Account | null) => {
	const tokens = useTokensStore((state) => state.tokens);
	const ankrBalances = useAnkrBalances(account);
	const tokenBalances = useTokenBalances(account, tokens);

	const balances = useMemo(() => {
		const joined = [...ankrBalances, ...tokenBalances];
		return uniq(joined, ({ token }) => tokenKey(token));
	}, [ankrBalances, tokenBalances]);

	return balances;
};
