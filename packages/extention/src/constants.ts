import { Network, WebmaxWallet } from "./core/types";

export const DEFAULT_WALLETS = [
	{ name: "Local Wallet", url: "http://localhost:5173" },
	{ name: "INTMAX", url: "https://wallet.intmax.io" },
	{ name: "Demo Wallet", url: "https://webmax2-wallet.vercel.app/" },
] satisfies WebmaxWallet[];

export const DEFAULT_NETWORKS = [
	{ namespace: "eip155", chainId: 1, httpRpcUrl: "https://eth.llamarpc.com" },
	{ namespace: "eip155", chainId: 137, httpRpcUrl: "https://polygon.llamarpc.com" },
] satisfies Network[];

export const EXTENSION_URL = "https://intmax.io";
