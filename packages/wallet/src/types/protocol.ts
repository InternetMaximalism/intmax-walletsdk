import type { AddEthereumChainParameter, TransactionRequest, WatchAssetParams } from "viem";

export type Namespace = "webmax" | "eip155";

export type EthereumAddress = `0x${string}`;
export type Hex = `0x${string}`;
export type Hash = `0x${string}`;

export type WebmaxHandshakeResult = {
	supportedNamespaces: Namespace[];
	chains: Record<Namespace, string[]>;
};

export type WebmaxMessageSchema = [
	{
		method: "webmax_handshake";
		params?: undefined;
		result: WebmaxHandshakeResult;
	},
];

export type EIP155MessageSchema = [
	{
		method: "eth_requestAccounts";
		params?: undefined;
		result: EthereumAddress[];
	},
	{
		method: "eth_sendTransaction";
		params: [transaction: TransactionRequest];
		result: Hash;
	},
	{
		method: "eth_sign";
		params: [address: EthereumAddress, data: Hex];
		result: Hex;
	},
	{
		method: "eth_signTransaction";
		params: [transaction: TransactionRequest];
		result: Hex;
	},
	{
		method: "eth_signTypedData_v4";
		params: [address: EthereumAddress, message: string];
		result: Hex;
	},
	{
		method: "personal_sign";
		params: [data: Hex, address: EthereumAddress];
		result: Hex;
	},
	{
		method: "wallet_addEthereumChain";
		params: [chainParams: AddEthereumChainParameter];
		result: null;
	},
	{
		method: "wallet_switchEthereumChain";
		params: [chain: { chainId: string }];
		result: null;
	},
	{
		method: "wallet_watchAsset";
		params: [asset: WatchAssetParams];
		result: null;
	},
];
