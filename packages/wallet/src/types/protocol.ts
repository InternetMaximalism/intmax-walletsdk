import type { AddEthereumChainParameter, TransactionRequest, WatchAssetParams } from "viem";

export type Namespaces = {
	EIP155: "eip155";
	EIP155_CHAIN: `eip155:${number}`;
	WEBMAX: "webmax";
};

export type Namespace = Namespaces[keyof Namespaces];

export type EthereumAddress = `0x${string}`;
export type Hex = `0x${string}`;
export type Hash = `0x${string}`;

export type WebmaxHandshakeResult = {
	supportedNamespaces: Namespace[];
};

export type WebmaxMessageSchema = [
	/**
	 * @description Handshake message sent when popup is opened and returns supported namespaces and chains to dApp.
	 */
	{
		method: "webmax_handshake";
		params?: undefined;
		result: WebmaxHandshakeResult;
	},
	/**
	 * @description Forbidden message sent when dApp tries to call a method before walletconnect.
	 */
	{
		method: "webmax_forbidden";
		params?: [napespace: Namespace, method: string];
		result?: undefined;
	},
];

export type EIP1193MessageSchema = [
	/**
	 * @description Requests that the user provides an Ethereum address to be identified by. This request also implies permission to access other methods.
	 * @link https://eips.ethereum.org/EIPS/eip-1102
	 */
	{
		namespace: Namespaces["EIP155_CHAIN"];
		method: "eth_requestAccounts";
		params?: undefined;
		result: EthereumAddress[];
	},
	/**
	 * @description Sign and send a new transaction.
	 * @link https://eips.ethereum.org/EIPS/eip-1193
	 */
	{
		namespace: Namespaces["EIP155_CHAIN"];
		method: "eth_sendTransaction";
		params: [transaction: TransactionRequest];
		result: Hash;
	},
	{
		namespace: Namespaces["EIP155_CHAIN"] | Namespaces["EIP155"];
		method: "eth_sign";
		params: [address: EthereumAddress, data: Hex];
		result: Hex;
	},
	{
		namespace: Namespaces["EIP155_CHAIN"];
		method: "eth_signTransaction";
		params: [transaction: TransactionRequest];
		result: Hex;
	},
	{
		namespace: Namespaces["EIP155_CHAIN"];
		method: "eth_signTypedData_v4";
		params: [address: EthereumAddress, message: string];
		result: Hex;
	},
	{
		namespace: Namespaces["EIP155_CHAIN"] | Namespaces["EIP155"];
		method: "personal_sign";
		params: [data: Hex, address: EthereumAddress];
		result: Hex;
	},
	{
		namespace: Namespaces["EIP155"];
		method: "wallet_addEthereumChain";
		params: [chainParams: AddEthereumChainParameter];
		result: null;
	},
	{
		namespace: Namespaces["EIP155"];
		method: "wallet_switchEthereumChain";
		params: [chain: { chainId: string }];
		result: null;
	},
	{
		namespace: Namespaces["EIP155_CHAIN"];
		method: "wallet_watchAsset";
		params: [asset: WatchAssetParams];
		result: null;
	},
];
