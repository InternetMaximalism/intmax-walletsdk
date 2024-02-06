import { useNetworksStore } from "@/stores/network";
import { Token } from "@/types";
import { useMemo } from "react";
import { Chain } from "viem";

export const useTokenWithChain = <T extends { token: Token }>(data: T[]): (T & { chain: Chain })[] => {
	const chains = useNetworksStore((state) => state.networks);
	const chainMap = useMemo(() => new Map(chains.map((chain) => [chain.id, chain])), [chains]);

	const result = useMemo(() => {
		return data.map((item) => ({ ...item, chain: chainMap.get(item.token.chainId) as Chain }));
	}, [data, chainMap]);

	return result;
};
