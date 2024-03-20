import { EXTENSION_URL } from "@/constants";
import { WebmaxWallet } from "@/core/types";
import { intmaxDappClient } from "intmax-walletsdk/dapp";
import { RefObject } from "react";

export const connectExtension = async (params: { wallet: WebmaxWallet; ref: RefObject<HTMLIFrameElement> }) => {
	const { wallet, ref } = params;
	if (!ref.current?.contentWindow) return;

	const client = intmaxDappClient({
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
