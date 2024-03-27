import { IntmaxReadyResult, Namespace } from "intmax-walletsdk";

export type SiteMetadata = { host: string; name: string; description: string; icons: string[] };

export type WebmaxWallet = {
	type: "webmax";
	name: string;
	logoUrl: string | null;
	url: string;
	isTestMode?: boolean;
};

export type InjectedWallet = {
	type: "injected";
	name: string;
	flag: string;
};

export type WalletMetadata = {
	url: string;
} & IntmaxReadyResult;

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
	name?: string;
	logoUrl?: string;
	isTestMode?: boolean;
	httpRpcUrl: string;
};

export type SiteRequest = {
	namespace: Namespace;
	method: string;
	params?: unknown;
	metadata: SiteMetadata;
};

export type PendingRequest = {
	id: string;
	namespace: Namespace;
	chainId?: string;
	method: string;
	params: unknown;
	wallet: WebmaxWallet;
	metadata: SiteMetadata;
};

export type RequestResult<T = unknown> = {
	id: string;
	result?: T;
	error?: { message: string; code: number };
};

export type PopupSettings = {
	isTestMode: boolean;
};
