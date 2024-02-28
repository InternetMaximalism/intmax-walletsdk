import { Namespace, WebmaxReadyResult } from "walletnext";

export type SiteMetadata = { host: string; name: string; description: string; icons: string[] };

export type WebmaxWallet = {
	name: string;
	url: string;
};

export type WalletMetadata = {
	url: string;
} & WebmaxReadyResult;

export type Session = {
	wallet: WebmaxWallet;
	host: string;
	namespaces: Namespace[];
	chainIds: Record<string, number>;
	accounts: Record<string, string[]>;
};

export type SessionKey = { wallet: WebmaxWallet; host: string };

export type Network = {
	namespace: Namespace;
	chainId: number;
	httpRpcUrl: string;
};
