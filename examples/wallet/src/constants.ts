import { Blockchain } from "@ankr.com/ankr.js";
import { arbitrum, arbitrumSepolia, bsc, mainnet, optimism, polygon, scroll } from "viem/chains";
import { bscTestnet, goerli, optimismSepolia, polygonMumbai, scrollSepolia, sepolia } from "viem/chains";
import invariant from "./lib/invariant";

export const ANKR_API_KEY =
	process.env.VITE_ANKR_API_KEY ?? "98e9658e77cb8fbb473c21f0129d90c08531fa006a2f82b9b81bf294041ef99b";
invariant(ANKR_API_KEY, "ANKR_API_KEY is required");

export const ANKR_BALANCE_CHAIN_MAP = {
	[mainnet.id]: "eth",
	[goerli.id]: "eth_goerli",
	[polygon.id]: "polygon",
	[polygonMumbai.id]: "polygon_mumbai",
	[arbitrum.id]: "arbitrum",
	[optimism.id]: "optimism",
	[scroll.id]: "scroll",
	[bsc.id]: "bsc",
} satisfies Record<number, Blockchain>;

export const ANKR_RPC_CHAIN_MAP = {
	[mainnet.id]: "eth",
	[goerli.id]: "eth_goerli",
	[sepolia.id]: "eth_sepolia",
	[polygon.id]: "polygon",
	[polygonMumbai.id]: "polygon_mumbai",
	[optimism.id]: "optimism",
	[optimismSepolia.id]: "optimism_sepolia",
	[arbitrum.id]: "arbitrum",
	[arbitrumSepolia.id]: "arbitrum_sepolia",
	[scroll.id]: "scroll",
	[scrollSepolia.id]: "scroll_sepolia",
	[bsc.id]: "bsc",
	[bscTestnet.id]: "bsc_testnet_chapel",
};

export const getAnkrRpcUrl = (chainId: number) => {
	const rpc = ANKR_RPC_CHAIN_MAP[chainId as keyof typeof ANKR_RPC_CHAIN_MAP];
	if (!rpc) throw new Error(`No Ankr RPC found for chainId: ${chainId}`);
	return `https://rpc.ankr.com/${rpc}/${ANKR_API_KEY}`;
};
