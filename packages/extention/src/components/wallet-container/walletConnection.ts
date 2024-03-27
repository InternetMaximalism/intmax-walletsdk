import { EXTENSION_URL } from "@/constants";
import { WebmaxWallet } from "@/core/types";
import { waitIframeWindowReady } from "@/lib/utils";
import { intmaxDappClient } from "intmax-walletsdk/dapp";

export async function connectWallet(wallet: WebmaxWallet, iframe: HTMLIFrameElement) {
	const window = await waitIframeWindowReady(iframe);

	const client = intmaxDappClient({
		wallet: {
			name: wallet.name,
			url: wallet.url,
			window: { mode: "custom", onClose: () => {}, window },
		},
		metadata: { name: "Webmax Extension", description: "Webmax Extension", icons: [], overrideUrl: EXTENSION_URL },
	});

	return await client.connect();
}
