import { ANKR_API_KEY, ANKR_BALANCE_CHAIN_MAP, AnkrBalanceChain } from "@/constants";
import { AnkrProvider } from "@ankr.com/ankr.js";

const cacheKey = { _: Symbol("AnkrProvider") };
const cache = new WeakMap<typeof cacheKey, AnkrProvider>();

export const getAnkrProvider = () => {
	if (cache.has(cacheKey)) return cache.get(cacheKey) as AnkrProvider;
	const endpoint = `https://rpc.ankr.com/multichain/${ANKR_API_KEY}`;
	const provider = new AnkrProvider(endpoint);
	provider.requestConfig = { headers: { "Content-Type": "application/json" } };
	cache.set(cacheKey, provider);
	return provider;
};

export const toAnkrChain = (chainId: number) => {
	if (chainId in ANKR_BALANCE_CHAIN_MAP) {
		return ANKR_BALANCE_CHAIN_MAP[chainId as AnkrBalanceChain];
	}
	return null;
};

export const toAnkrChains = (chainIds: number[]) => {
	return chainIds.map(toAnkrChain).filter((chain): chain is NonNullable<typeof chain> => chain !== null);
};
