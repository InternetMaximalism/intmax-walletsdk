import { DappMetadata } from "src";
import { Chain } from "viem";
import { WalletNextConnector } from "../wagmi-v1";

export type WalletNextOptions = {
	chains?: Chain[];
	metadata?: DappMetadata;
	wallet: { name?: string; url: string; iconUrl?: string };
	defaultChainId?: number;
};

export const walletnext = (options: WalletNextOptions) => ({
	id: "walletnext",
	name: options.wallet.name || "WalletNext",
	iconUrl: options.wallet.iconUrl,
	iconBackground: "#fff",
	createConnector: () => {
		return { connector: new WalletNextConnector(options) };
	},
});
