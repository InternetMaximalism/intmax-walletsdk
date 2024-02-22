import { AbstractRequest, DappMetadata, WebmaxHost } from "src";

export const composeWebmaxHost = (request: AbstractRequest, origin: string): WebmaxHost => {
	const metadata = request.metadata as DappMetadata;
	if (!metadata?.overrideUrl) return `origin:${origin}`;
	return `origin:${origin},url:${metadata.overrideUrl}`;
};

export const parseWebmaxHost = (host: WebmaxHost): { origin: string; url?: string } => {
	const [origin, url] = host.split(",");
	return { origin: origin.replace("origin:", ""), url: url?.replace("url:", "") };
};
