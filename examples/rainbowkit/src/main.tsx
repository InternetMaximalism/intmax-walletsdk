import "@rainbow-me/rainbowkit/styles.css";
import "./global.css";

import { RainbowKitProvider, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { http, WagmiProvider, createConfig } from "wagmi";
import { arbitrum, mainnet, optimism, polygon } from "wagmi/chains";
import App from "./App";

import { intmaxwalletsdk } from "intmax-walletsdk/rainbowkit";

const additionalWallets = [
	intmaxwalletsdk({
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
		wallet: {
			url: "https://wallet.intmax.io",
			name: "INTMAX Wallet",
			iconUrl: "https://wallet.intmax.io/favicon.ico",
		},
		metadata: {
			name: "Rainbow-Kit Demo",
			description: "Rainbow-Kit Demo",
			icons: ["https://intmaxwallet-sdk-wallet.vercel.app/vite.svg"],
		},
	}),
];

const config = createConfig({
	chains: [mainnet, polygon, optimism, arbitrum],
	transports: {
		[mainnet.id]: http(),
		[polygon.id]: http(),
		[optimism.id]: http(),
		[arbitrum.id]: http(),
	},
	connectors: connectorsForWallets(
		[
			{
				groupName: "IntmaxWalletSDK",
				wallets: additionalWallets,
			},
		],
		{ projectId: "N/A", appName: "Rainbow-Kit Example" },
	),
});

const queryClient = new QueryClient();

const root = document.getElementById("root");
if (!root) throw new Error("No root element found");

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider>
					<App />
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	</React.StrictMode>,
);
