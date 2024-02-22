import { EXTENSION_URL } from "@/constants";
import { WebmaxWallet } from "@/core/types";
import { useWalletMetadataStore } from "@/popup/stores/wallet";
import { FC, useCallback, useEffect, useRef } from "react";
import { webmaxDappClient } from "webmax2/dapp";

export const WalletIframe: FC<{
	wallet: WebmaxWallet;
	className?: string;
}> = ({ wallet, className }) => {
	const ref = useRef<HTMLIFrameElement>(null);
	const setMetadata = useWalletMetadataStore((state) => state.setMetadata);

	const handshake = useCallback(async () => {
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
		const metadata = { ...result, url: wallet.url };
		setMetadata(wallet, metadata);
	}, [wallet, setMetadata]);

	useEffect(() => {
		handshake();
	}, [handshake]);

	return <iframe ref={ref} title={wallet.name} src={wallet.url} className={className} />;
};
