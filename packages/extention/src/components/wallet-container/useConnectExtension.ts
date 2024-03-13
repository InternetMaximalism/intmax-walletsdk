import { EXTENSION_URL } from "@/constants";
import { WebmaxWallet } from "@/core/types";
import { waitIframeWindowReady } from "@/lib/utils";
import { useWalletMetadataStore } from "@/popup/stores/wallet";
import { RefObject, useCallback } from "react";
import { webmaxDappClient } from "walletnext/dapp";

export const useConnectExtension = (wallet: WebmaxWallet, ref: RefObject<HTMLIFrameElement>) => {
	const setMetadata = useWalletMetadataStore((state) => state.setMetadata);

	const connect = useCallback(async () => {
		if (!ref.current?.contentWindow) return;

		console.info("WalletContainer connect", wallet);
		await waitIframeWindowReady(ref.current);

		console.info("WalletContainer connect2", wallet);

		const client = webmaxDappClient({
			wallet: {
				name: wallet.name,
				url: wallet.url,
				window: { mode: "custom", onClose: () => {}, window: ref.current.contentWindow },
			},
			metadata: { name: "Webmax Extension", description: "Webmax Extension", icons: [], overrideUrl: EXTENSION_URL },
		});

		const result = await client.connect();

		console.info("WalletContainer connect3", result);
		const metadata = { ...result, url: wallet.url };
		setMetadata(wallet, metadata);
	}, [wallet, setMetadata, ref]);

	return { connect };
};
