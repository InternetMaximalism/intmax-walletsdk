import { Wallet } from "rainbowkit-v2";
import { DappMetadata } from "src";
import { createConnector } from "wagmi-v2";
import { walletnext as walletnextConnector } from "../wagmi-v2";

export type WalletNextOptions = {
	metadata?: DappMetadata;
	wallet: { name?: string; url: string; iconUrl?: string };
	mode?: "iframe" | "popup";
	defaultChainId?: number;
};

export const walletnext = (options: WalletNextOptions): Wallet => ({
	id: `walletnext-${options.wallet.url}-${options.mode}`,
	name: options.wallet.name || "WalletNext",
	iconUrl: options.wallet.iconUrl ?? "",
	iconBackground: "#fff",
	createConnector: (walletDetails) => {
		return createConnector((config) => ({
			...walletnextConnector(options)(config),
			...walletDetails,
		}));
	},
});
