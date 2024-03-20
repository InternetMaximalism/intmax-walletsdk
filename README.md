# Wallet Next SDK

Wallet Next SDK is a implementation of the Webmax protocol for Dapp and Wallet.

## Overview

This SDK is designed to facilitate communication between the Dapp and Wallet sides of the Webmax protocol respectively.
For more information on the Webmax protocol, see Proposal below.

## Demo URL

- [Dapp Example](https://walletnext-dapp.vercel.app/)
- [Wallet Example](https://walletnext-wallet.vercel.app/)
- [Rainbow Kit Example](https://walletnext-rainbowkit.vercel.app/)

## Dapp SDK Example

```typescript
import { ethereumProvider, intmaxDappClient } from "intmax-walletsdk/dapp";

const DEFAULT_WALLET_URL = "YOUR_WALLET_URL" // e.g. https://webmax2-wallet.vercel.app
const DEFAULT_DAPP_ICON = "YOUR_DAPP_ICON_URL"
const DAPP_METADATA = {
	name: "Webmax Dapp Example",
	description: "This is a simple example of how to use the webmax dapp client.",
	icons: [DEFAULT_DAPP_ICON],
};

const client = intmaxDappClient({
  wallet: { url: walletUrl, name: "DEMO Wallet", window: { mode: "iframe" } },
  metadata: DAPP_METADATA,
  providers: {
    eip155: ethereumProvider({
      httpRpcUrls: {
        1: "https://mainnet.infura.io/v3",
        137: "https://rpc-mainnet.maticvigil.com",
      },
    }),
  },
});


const ethereum = await webmax.provider("eip155"); //or webmax.provider("eip155:1");

// Note: you can switch chain by using wallet_switchEthereumChain method
// ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x89" }] });

const accounts = await ethereum.request({
  method: "eth_requestAccounts",
  params: [],
});
console.log(accounts);

const result = await ethereum.request({
  method: "eth_sign",
  params: [accounts[0], "Hello Webmax"],
});
console.log(result);
```

## Dapp SDK with Rainbow Kit Example

```typescript

import { intmaxwalletsdk } from "intmax-walletsdk/rainbowkit";

...

const walletnextWallets = [
	intmaxwalletsdk({
		wallet: {
			url: "https://webmax2-wallet.vercel.app",
			name: "IntmaxWalletSDK Demo",
			iconUrl: "https://webmax2-wallet.vercel.app/vite.svg",
		},
		metadata: {
			name: "Rainbow-Kit Demo",
			description: "Rainbow-Kit Demo",
			icons: ["https://webmax2-wallet.vercel.app/vite.svg"],
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

...


```

## Wallet SDK

```typescript
import { intmaxWalletClient } from "walletnext/wallet";

const sdk = intmaxWalletClient();

sdk.on("intmax/intmax_ready", (c) => {
	return c.success({
		supportedNamespaces: ["eip155", "webmax"],
		supportedChains: supportedChains,
	});
});

sdk.on("eip155/eth_requestAccounts", (c) => {
    return c.success({
        accounts: ["0x1234..."],
    });
});

...other methods

sdk.ready();

```

# INTMAX WalletSDK Protocol Proposal

See [DESIGN.md](./DESIGN.md)