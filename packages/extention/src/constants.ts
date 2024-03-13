import { Network, WebmaxWallet } from "./core/types";

export const DEFAULT_WALLETS = [
	{
		type: "webmax",
		name: "Local Wallet",
		logoUrl: "http://localhost:5173/vite.svg",
		url: "http://localhost:5173",
	},
	{
		type: "webmax",
		name: "Demo Wallet",
		logoUrl: "https://walletnext-wallet.vercel.app/vite.svg",
		url: "https://walletnext-wallet.vercel.app",
	},
	{
		type: "webmax",
		name: "INTMAX",
		logoUrl: "https://wallet.intmax.io/icon-512x512.png",
		url: "https://wallet.intmax.io",
	},
] satisfies WebmaxWallet[];

export const DEFAULT_NETWORKS = [
	{ namespace: "eip155", chainId: 1, httpRpcUrl: "https://rpc.ankr.com/eth" },
	{ namespace: "eip155", chainId: 137, httpRpcUrl: "https://rpc.ankr.com/polygon" },
] satisfies Network[];

export const EXTENSION_URL = "https://intmax.io";
