import { WebmaxWallet } from "@/core/types";
import { FC, useRef } from "react";
import { useWalletContainerEffects } from "./useWalletContainerEffects";

interface WalletContainerProps {
	wallet: WebmaxWallet;
	className?: string;
}

export const WalletContainer: FC<WalletContainerProps> = ({ wallet, className }) => {
	const iframeRef = useRef<HTMLIFrameElement>(null);

	useWalletContainerEffects(wallet, iframeRef);

	return (
		<iframe
			ref={iframeRef}
			title={wallet.name}
			src={wallet.url}
			className={className}
			allow="clipboard-write; encrypted-media; web-share; publickey-credentials-get"
		/>
	);
};
