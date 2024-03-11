import "@rainbow-me/rainbowkit/styles.css";
import "./global.css";

import { RainbowKitProvider, connectorsForWallets, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { http, WagmiProvider, createConfig } from "wagmi";
import { arbitrum, mainnet, optimism, polygon } from "wagmi/chains";
import App from "./App";

import { walletnext } from "walletnext/rainbowkit";

const additionalWallets = [
	walletnext({
		wallet: {
			url: "https://walletnext-wallet.vercel.app",
			name: "WalletNext Demo",
			iconUrl: "https://walletnext-wallet.vercel.app/vite.svg",
		},
		metadata: {
			name: "Rainbow-Kit Demo",
			description: "Rainbow-Kit Demo",
			icons: ["https://walletnext-wallet.vercel.app/vite.svg"],
		},
	}),
	walletnext({
		mode: "iframe",
		wallet: {
			url: "https://walletnext-wallet.vercel.app",
			name: "WalletNext Demo - IFrame",
			iconUrl: "https://walletnext-wallet.vercel.app/vite.svg",
		},
		metadata: {
			name: "Rainbow-Kit Demo",
			description: "Rainbow-Kit Demo",
			icons: ["https://walletnext-wallet.vercel.app/vite.svg"],
		},
	}),
	walletnext({
		wallet: {
			url: "https://wallet.intmax.io",
			name: "INTMAX Wallet",
			iconUrl: "https://wallet.intmax.io/favicon.ico",
		},
		metadata: {
			name: "Rainbow-Kit Demo",
			description: "Rainbow-Kit Demo",
			icons: ["https://walletnext-wallet.vercel.app/vite.svg"],
		},
	}),
];

const config = getDefaultConfig({
	chains: [mainnet, polygon, optimism, arbitrum],
	projectId: "YOUR_PROJECT_ID",
	appName: "YOUR_APP",
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
