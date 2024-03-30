import { popupMessaging } from "@/core/messagings/popup";
import { PendingRequest, WebmaxWallet } from "@/core/types";
import { waitIframeWindowReady } from "@/lib/utils";
import { ethereumProvider, intmaxDappClient } from "intmax-walletsdk/dapp";

export async function handleWalletRequest(wallet: WebmaxWallet, request: PendingRequest, iframe: HTMLIFrameElement) {
	const contentWindow = iframe?.contentWindow;
	if (!(iframe && contentWindow)) return;

	await new Promise((resolve) => setTimeout(resolve, 500));
	await waitIframeWindowReady(iframe);

	const client = intmaxDappClient({
		wallet: {
			name: wallet.name,
			url: wallet.url,
			window: { mode: "custom", onClose: () => {}, window: contentWindow },
		},
		metadata: { ...request.metadata, overrideUrl: request.metadata.host },
		providers: { eip155: ethereumProvider() },
	});

	const provider = await client.provider("eip155");
	await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: request.chainId }] });
	const result = await provider.request({ method: request.method, params: request.params });

	await popupMessaging.sendMessage("onResult", { id: request.id, result });
}
