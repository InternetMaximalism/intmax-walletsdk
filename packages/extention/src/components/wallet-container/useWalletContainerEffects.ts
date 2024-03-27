import { handleAdditionalStorageRequest } from "@/core/additional-storage";
import { popupMessaging } from "@/core/messagings/popup";
import { PendingRequest, WebmaxWallet } from "@/core/types";
import { useRequestStore } from "@/popup/stores/request";
import { useWalletMetadataStore } from "@/popup/stores/wallet";
import { useEffect, useRef } from "react";
import { connectWallet } from "./walletConnection";
import { handleWalletRequest } from "./walletRequestHandler";

export function useWalletContainerEffects(wallet: WebmaxWallet, iframeRef: React.RefObject<HTMLIFrameElement>) {
	const requests = useRequestStore((state) => state.pendingRequest);
	const approvingRequestsRef = useRef<null | PendingRequest>(null);
	const setMetadata = useWalletMetadataStore((state) => state.setMetadata);

	const request = requests?.[wallet.url];

	useEffect(() => {
		const listener = async (event: MessageEvent) => {
			if (event.source !== iframeRef.current?.contentWindow) return;
			const result = await handleAdditionalStorageRequest(event);
			if (result) iframeRef.current?.contentWindow?.postMessage(result, event.origin);
		};

		window.addEventListener("message", listener);
		return () => window.removeEventListener("message", listener);
	}, [iframeRef]);

	useEffect(() => {
		if (!(iframeRef.current?.contentWindow && request)) return;

		if (approvingRequestsRef.current) return;
		approvingRequestsRef.current = request;

		const connect = async () => {
			if (!iframeRef.current) return;
			const result = await connectWallet(wallet, iframeRef.current);
			setMetadata(wallet, { ...result, url: wallet.url });
		};

		handleWalletRequest(wallet, request, connect, iframeRef.current).catch((error) => {
			console.error("WalletContainer error", error);
			approvingRequestsRef.current = null;
			popupMessaging.sendMessage("onResult", { id: request.id, error });
		});
	}, [wallet, request, iframeRef, setMetadata]);
}
