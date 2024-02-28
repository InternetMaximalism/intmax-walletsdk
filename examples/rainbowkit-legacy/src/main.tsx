import "@rainbow-me/rainbowkit/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { walletnext } from "walletnext/rainbowkit-legacy";
import App from "./App";
import "./global.css";

import { RainbowKitProvider, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { arbitrum, base, mainnet, optimism, polygon, zora } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
	[mainnet, polygon, optimism, arbitrum, base, zora],
	[publicProvider()],
);

const additionalWallets = [
	walletnext({
		chains,
		wallet: {
			url: "https://webmax2-wallet.vercel.app",
			name: "WalletNext Demo",
			iconUrl: "https://webmax2-wallet.vercel.app/vite.svg",
		},
		metadata: {
			name: "Rainbow-Kit Legacy Demo",
			description: "Rainbow-Kit Legacy Demo",
			icons: ["https://webmax2-wallet.vercel.app/vite.svg"],
		},
	}),
	walletnext({
		chains,
		mode: "iframe",
		wallet: {
			url: "https://webmax2-wallet.vercel.app",
			name: "WalletNext Demo - IFrame",
			iconUrl: "https://webmax2-wallet.vercel.app/vite.svg",
		},
		metadata: {
			name: "Rainbow-Kit Legacy Demo",
			description: "Rainbow-Kit Legacy Demo",
			icons: ["https://webmax2-wallet.vercel.app/vite.svg"],
		},
	}),
	walletnext({
		chains,
		wallet: {
			url: "https://wallet.intmax.io",
			name: "INTMAX Wallet",
			iconUrl: "https://wallet.intmax.io/favicon.ico",
		},
		metadata: {
			name: "Rainbow-Kit Legacy Demo",
			description: "Rainbow-Kit Legacy Demo",
			icons: ["https://webmax2-wallet.vercel.app/vite.svg"],
		},
	}),
];

const connectors = connectorsForWallets([
	{
		groupName: "WalletNext",
		wallets: additionalWallets,
	},
]);

const wagmiConfig = createConfig({
	autoConnect: true,
	connectors,
	publicClient,
});

const root = document.getElementById("root");
if (!root) throw new Error("No root element found");

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<WagmiConfig config={wagmiConfig}>
			<RainbowKitProvider chains={chains}>
				<App />
			</RainbowKitProvider>
		</WagmiConfig>
	</React.StrictMode>,
);
