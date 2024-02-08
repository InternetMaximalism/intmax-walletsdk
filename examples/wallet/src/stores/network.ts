import { Chain } from "viem";
import { arbitrum, arbitrumSepolia, astar, bsc, mainnet, optimism, polygon, scroll } from "viem/chains";
import { bscTestnet, goerli, optimismSepolia, polygonMumbai, scrollSepolia, sepolia } from "viem/chains";
import { create } from "zustand";
import { ArrayUpdater, applyUpdater } from "./utils";

const DEFAULT_MAINNETS = [mainnet, optimism, polygon, arbitrum, astar, scroll, bsc];
const DEFAULT_TESTNETS = [goerli, sepolia, optimismSepolia, bscTestnet, arbitrumSepolia, scrollSepolia, polygonMumbai];

export type NetworksStore = {
	networks: Chain[];
	setNetworks: ArrayUpdater<Chain>;
	reset: () => void;
};

const initialState = {
	networks: [...DEFAULT_MAINNETS, ...DEFAULT_TESTNETS],
};

export const useNetworksStore = create<NetworksStore>((set) => ({
	...initialState,
	setNetworks: (cbOrNetworks) => set((state) => ({ networks: applyUpdater(cbOrNetworks, state.networks) })),
	reset: () => set(initialState),
}));
