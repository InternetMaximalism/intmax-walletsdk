import "@rainbow-me/rainbowkit/styles.css";
import { intmaxwalletsdk } from "intmax-walletsdk/rainbowkit-legacy";
import React from "react";
import ReactDOM from "react-dom/client";
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
	intmaxwalletsdk({
		chains,
		wallet: {
			url: "https://intmaxwallet-sdk-wallet.vercel.app/",
			name: "IntmaxWalletSDK Demo",
			iconUrl: "https://intmaxwallet-sdk-wallet.vercel.app/vite.svg",
		},
		metadata: {
			name: "Rainbow-Kit Demo",
			description: "Rainbow-Kit Demo",
			icons: ["https://intmaxwallet-sdk-wallet.vercel.app/vite.svg"],
		},
	}),
	intmaxwalletsdk({
		chains,
		mode: "iframe",
		wallet: {
			url: "https://intmaxwallet-sdk-wallet.vercel.app/",
			name: "IntmaxWalletSDK Demo",
			iconUrl: "https://intmaxwallet-sdk-wallet.vercel.app/vite.svg",
		},
		metadata: {
			name: "Rainbow-Kit Demo",
			description: "Rainbow-Kit Demo",
			icons: ["https://intmaxwallet-sdk-wallet.vercel.app/vite.svg"],
		},
	}),
	intmaxwalletsdk({
		chains,
		wallet: {
			url: "https://intmaxwallet-sdk-wallet.vercel.app/",
			name: "IntmaxWalletSDK Demo",
			iconUrl: "https://intmaxwallet-sdk-wallet.vercel.app/vite.svg",
		},
		metadata: {
			name: "Rainbow-Kit Demo",
			description: "Rainbow-Kit Demo",
			icons: ["https://intmaxwallet-sdk-wallet.vercel.app/vite.svg"],
		},
	}),
];

const connectors = connectorsForWallets([
	{
		groupName: "IntmaxWalletSDK",
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
