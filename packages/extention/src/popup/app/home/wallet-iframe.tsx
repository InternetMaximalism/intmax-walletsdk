import { WebmaxWallet } from "@/core/types";
import { FC, useCallback, useEffect, useRef } from "react";
import { webmaxDappClient } from "webmax2/dapp";

export const WalletIframe: FC<{
	wallet: WebmaxWallet;
	className?: string;
}> = ({ wallet, className }) => {
	const ref = useRef<HTMLIFrameElement>(null);

	const handshake = useCallback(async () => {
		if (!ref.current?.contentWindow) return;

		const client = webmaxDappClient({
			wallet: {
				name: wallet.name,
				url: wallet.url,
				window: { mode: "custom", onClose: () => {}, window: ref.current.contentWindow },
			},
			metadata: { name: "Webmax Extension", description: "Webmax Extension", icons: [] },
		});

		const result = await client.connect();
	}, [wallet]);

	useEffect(() => {
		handshake();
	}, [handshake]);

	return <iframe ref={ref} title={wallet.name} src={wallet.url} className={className} />;
};
