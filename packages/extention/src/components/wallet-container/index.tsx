import { EXTENSION_URL } from "@/constants";
import { WebmaxWallet } from "@/core/types";
import { usePendingRequestStore } from "@/popup/stores/request";
import { FC, useEffect, useRef } from "react";
import { ethereumProvider, webmaxDappClient } from "walletnext/dapp";
import { useConnectExtension } from "./useConnectExtension";

export const WalletContainer: FC<{
	wallet: WebmaxWallet;
	className?: string;
}> = ({ wallet, className }) => {
	const requests = usePendingRequestStore((state) => state.pendingRequests);
	const ref = useRef<HTMLIFrameElement>(null);
	const { connect } = useConnectExtension(wallet, ref);

	console.debug("WalletContainer", wallet, requests);

	useEffect(() => {
		(async () => {
			await connect().then(() => new Promise((resolve) => setTimeout(resolve, 500)));

			if (!(requests?.length && ref.current?.contentWindow)) return;
			const [request] = requests;

			try {
				ref.current?.contentWindow?.origin;
				await new Promise((resolve) => ref.current?.addEventListener("load", resolve));
			} catch {}
			console.info("WalletContainer request", request, wallet, Date.now());

			const client = webmaxDappClient({
				wallet: {
					name: wallet.name,
					url: wallet.url,
					window: { mode: "custom", onClose: () => {}, window: ref.current.contentWindow },
				},
				metadata: { ...request.metadata, overrideUrl: request.metadata.host },
				providers: { eip155: ethereumProvider() },
			});

			const provider = await client.provider("eip155");
			const result = await provider.request({ method: request.method, params: request.params });
		})();
	}, [requests, wallet, connect]);

	return <iframe ref={ref} title={wallet.name} src={wallet.url} className={className} />;
};
