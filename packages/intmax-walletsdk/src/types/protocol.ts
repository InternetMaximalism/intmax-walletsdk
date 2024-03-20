import type { AddEthereumChainParameter, RpcTransactionRequest, WatchAssetParams } from "viem";
import { Prettify } from "./utils";

export type WalletHost = `origin:${string}` | `origin:${string}:url:${string}`;
export type DappMetadata = { name: string; description: string; icons: string[]; overrideUrl?: string };

export type Namespaces = { EIP155: "eip155"; INTMAX: "intmax" };
export type Namespace = Namespaces[keyof Namespaces];
export type ChainedNamespace<NS extends string = string> = `${NS}:${string}`;

export type EthereumAddress = `0x${string}`;
export type Hex = `0x${string}`;
export type Hash = `0x${string}`;

export type WalletHandleTypes = "approval" | "notice";
export type DappHandleTypes = "readonly";

export type AbstractMessageSchema = {
	type: WalletHandleTypes | DappHandleTypes;
	namespace: string;
	method: string;
	params?: unknown;
	result?: unknown;
}[];

export type IntmaxReadyResult = {
	supportedNamespaces: Namespace[];
	supportedChains: ChainedNamespace[];
};

export type IntmaxConnectResult = Prettify<IntmaxReadyResult & { accounts: { eip155: EthereumAddress[] } }>;

export type IntmaxMessageSchema = [
	/**
	 * @description Handshake message sent when popup is opened and returns supported namespaces and chains to dApp.
	 */
	{
		type: "notice";
		namespace: Namespaces["INTMAX"];
		method: "intmax_ready";
		params?: undefined;
		result: IntmaxReadyResult;
	},
	/**
	 * @description Handshake message sent when popup is opened and returns supported namespaces and chains to dApp.
	 */
	{
		type: "approval";
		namespace: Namespaces["INTMAX"];
		method: "intmax_connect";
		params?: undefined;
		result: IntmaxConnectResult;
	},
];

export type EthApprovalMessageSchema = [
	/**
	 * @description Requests that the user provides an Ethereum address to be identified by. This request also implies permission to access other methods.
	 * @link https://eips.ethereum.org/EIPS/eip-1102
	 */
	{
		type: "approval";
		namespace: Namespaces["EIP155"];
		method: "eth_requestAccounts";
		params?: undefined;
		result: EthereumAddress[];
	},
	/**
	 * @description Sign and send a new transaction.
	 * @link https://eips.ethereum.org/EIPS/eip-1193
	 */
	{
		type: "approval";
		namespace: Namespaces["EIP155"];
		method: "eth_sendTransaction";
		params: [transaction: RpcTransactionRequest];
		result: Hash;
	},
	{
		type: "approval";
		namespace: Namespaces["EIP155"];
		method: "eth_sign";
		params: [address: EthereumAddress, data: Hex];
		result: Hex;
	},
	{
		type: "approval";
		namespace: Namespaces["EIP155"];
		method: "eth_signTransaction";
		params: [transaction: RpcTransactionRequest];
		result: Hex;
	},
	{
		type: "approval";
		namespace: Namespaces["EIP155"];
		method: "eth_signTypedData_v4";
		params: [address: EthereumAddress, message: string | object];
		result: Hex;
	},
	{
		type: "approval";
		namespace: Namespaces["EIP155"];
		method: "personal_sign";
		params: [data: Hex, address: EthereumAddress];
		result: Hex;
	},
	{
		type: "approval";
		namespace: Namespaces["EIP155"];
		method: "wallet_addEthereumChain";
		params: [chainParams: AddEthereumChainParameter];
		result: null;
	},
	{
		type: "approval";
		namespace: Namespaces["EIP155"];
		method: "wallet_watchAsset";
		params: [asset: WatchAssetParams];
		result: null;
	},
];

export type EthReadonlyMessageSchema = [
	{
		type: "readonly";
		namespace: Namespaces["EIP155"];
		method: "eth_accounts";
		params?: undefined;
		result: EthereumAddress[];
	},
	{
		type: "readonly";
		namespace: Namespaces["EIP155"];
		method: "eth_chainId";
		params?: undefined;
		result: string;
	},
	{
		type: "readonly";
		namespace: Namespaces["EIP155"];
		method: "wallet_switchEthereumChain";
		params: [chain: { chainId: string }];
		result: null;
	},
];

export type DefaultMessageSchema = [...IntmaxMessageSchema, ...EthApprovalMessageSchema, ...EthReadonlyMessageSchema];

export type SchemaNamespace<Schema extends AbstractMessageSchema> = Schema[number]["namespace"];

export type ExtractSchema<
	Schema extends AbstractMessageSchema,
	Type extends Schema[number]["type"] = Schema[number]["type"],
> = { [K in keyof Schema]: Schema[K]["type"] extends Type ? Schema[K] : never };
