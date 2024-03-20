# INTMAX WalletSDK

INTMAX WalletSDK is a protocol and SDK for connecting Web Wallets with Dapps.

## Overview

This SDK is for dapp and wallet to interact with each other using the INTMAX WalletSDK.
For more information on the protocol, See [DESIGN.md](./DESIGN.md).

## Demo URL

- [Dapp Example](https://intmaxwallet-sdk-dapp.vercel.app/)
- [Wallet Example](https://intmaxwallet-sdk-wallet.vercel.app/)
- [Rainbow Kit Example](https://intmaxwallet-sdk-rainbowkit.vercel.app/)

## Dapp SDK Example

```typescript
import { ethereumProvider, intmaxDappClient } from "intmax-walletsdk/dapp";

const DEFAULT_WALLET_URL = "YOUR_WALLET_URL" // e.g. "https://intmaxwallet-sdk-wallet.vercel.app/"
const DEFAULT_DAPP_ICON = "YOUR_DAPP_ICON_URL"
const DAPP_METADATA = {
	name: "Dapp Example",
	description: "This is a simple example of how to use the walletSDK dapp client.",
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


const ethereum = await client.provider("eip155"); //or client.provider("eip155:1");

// Note: you can switch chain by using wallet_switchEthereumChain method
// ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x89" }] });

const accounts = await ethereum.request({
  method: "eth_requestAccounts",
  params: [],
});
console.log(accounts);

const result = await ethereum.request({
  method: "eth_sign",
  params: [accounts[0], "Hello INTMAX WalletSDK!"],
});
console.log(result);
```

## Dapp SDK with Rainbow Kit Example

```typescript

import { intmaxwalletsdk } from "intmax-walletsdk/rainbowkit";

...

const wallets = [
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
				wallets,
			},
		],
		{ projectId: "N/A", appName: "Rainbow-Kit Example" },
	),
});

...


```

## Wallet SDK

```typescript
import { intmaxWalletClient } from "intmax-walletsdk/wallet";

const sdk = intmaxWalletClient();

sdk.on("intmax/intmax_ready", (c) => {
	return c.success({
		supportedNamespaces: ["eip155", "intmax"],
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