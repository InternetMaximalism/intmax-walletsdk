import { Chain, Wallet } from "rainbowkit-v1";
import { DappMetadata } from "src";
import { WalletNextConnector } from "../wagmi-v1";

export type WalletNextOptions = {
	chains?: Chain[];
	metadata?: DappMetadata;
	wallet: { name?: string; url: string; iconUrl?: string };
	mode?: "iframe" | "popup";
	defaultChainId?: number;
};

export const walletnext = (options: WalletNextOptions): Wallet => ({
	id: "walletnext",
	name: options.wallet.name || "WalletNext",
	iconUrl: options.wallet.iconUrl ?? "",
	iconBackground: "#fff",
	createConnector: () => {
		return { connector: new WalletNextConnector(options) };
	},
});
