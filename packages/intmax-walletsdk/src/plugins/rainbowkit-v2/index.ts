import { Wallet } from "rainbowkit-v2";
import { DappMetadata } from "src";
import { createConnector } from "wagmi-v2";
import { intmaxwalletsdk as intmaxwalletsdkConnector } from "../wagmi-v2";

export type WalletNextOptions = {
	metadata?: DappMetadata;
	wallet: { name?: string; url: string; iconUrl?: string };
	mode?: "iframe" | "popup";
	defaultChainId?: number;
};

export const intmaxwalletsdk = (options: WalletNextOptions) => (): Wallet => ({
	id: `walletnext-${options.wallet.url}-${options.mode}`,
	name: options.wallet.name || "Intmax Wallet",
	iconUrl: options.wallet.iconUrl ?? "",
	iconBackground: "#fff",
	createConnector: (walletDetails) => {
		return createConnector((config) => ({
			...intmaxwalletsdkConnector(options)(config),
			...walletDetails,
		}));
	},
});
