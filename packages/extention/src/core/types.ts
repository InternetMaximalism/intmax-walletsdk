import { Namespace } from "webmax2";

export type SiteMetadata = { host: string; name: string; description: string; icons: string[] };

export type WebmaxWallet = {
	name: string;
	url: string;
};

export type Session = {
	wallet: WebmaxWallet;
	host: string;
	namespaces: Namespace[];
	chainIds: Record<string, number>;
	accounts: Record<string, string[]>;
};

export type SessionKey = { wallet: WebmaxWallet; host: string };
