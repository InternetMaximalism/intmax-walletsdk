import { Wallet } from "@rainbow-me/rainbowkit";
import { DappMetadata } from "src";
import { createConnector } from "wagmi";
import { intmaxwalletsdk as intmaxwalletsdkConnector } from "../wagmi-v2";

export type IntmaxWalletSDKOptions = {
	metadata?: DappMetadata;
	wallet: { name?: string; url: string; iconUrl?: string };
	mode?: "iframe" | "popup";
	defaultChainId?: number;
};

export const intmaxwalletsdk = (options: IntmaxWalletSDKOptions) => (): Wallet => ({
	id: `intmax:${options.wallet.url}:${options.mode}`,
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
