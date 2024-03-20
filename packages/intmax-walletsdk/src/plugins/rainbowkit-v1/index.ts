import { DappMetadata } from "src";
import { Chain } from "wagmi-v1";
import { IntmxWalletSDKConnector } from "../wagmi-v1";

interface RainbowKitChain {
	id: number;
	name?: string;
	iconUrl?: string | (() => Promise<string>) | null;
	iconBackground?: string;
}

export type IntmaxWalletSDKOptions = {
	chains?: (Chain & RainbowKitChain)[];
	metadata?: DappMetadata;
	wallet: { name?: string; url: string; iconUrl?: string };
	mode?: "iframe" | "popup";
	defaultChainId?: number;
};

export const intmaxwalletsdk = (options: IntmaxWalletSDKOptions) => ({
	id: `intmax:${options.wallet.url}:${options.mode}`,
	name: options.wallet.name || "INTMAX Wallet",
	iconUrl: options.wallet.iconUrl ?? "",
	iconBackground: "#fff",
	createConnector: () => ({ connector: new IntmxWalletSDKConnector(options) }),
});
