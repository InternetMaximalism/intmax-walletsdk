import { EXTENSION_URL } from "@/constants";
import { WebmaxWallet } from "@/core/types";
import { RefObject } from "react";
import { webmaxDappClient } from "walletnext/dapp";

export const connectExtension = async (params: { wallet: WebmaxWallet; ref: RefObject<HTMLIFrameElement> }) => {
	const { wallet, ref } = params;
	if (!ref.current?.contentWindow) return;

	const client = webmaxDappClient({
		wallet: {
			name: wallet.name,
			url: wallet.url,
			window: { mode: "custom", onClose: () => {}, window: ref.current.contentWindow },
		},
		metadata: { name: "Webmax Extension", description: "Webmax Extension", icons: [], overrideUrl: EXTENSION_URL },
	});

	const result = await client.connect();
	return result;
};
