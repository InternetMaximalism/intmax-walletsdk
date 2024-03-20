import { AbstractRequest, DappMetadata, WalletHost } from "src";

export const composeWalletHost = (request: AbstractRequest, origin: string): WalletHost => {
	const metadata = request.metadata as DappMetadata;
	if (!metadata?.overrideUrl) return `origin:${origin}`;
	return `origin:${origin},url:${metadata.overrideUrl}`;
};

export const parseWalletHost = (host: WalletHost): { origin: string; url?: string } => {
	const [origin, url] = host.split(",");
	return { origin: origin.replace("origin:", ""), url: url?.replace("url:", "") };
};
