import type { AddEthereumChainParameter, RpcTransactionRequest, WatchAssetParams } from "viem";
import { Prettify } from "./utils";

export type WebmaxHost = `origin:${string}` | `origin:${string}:url:${string}`;
export type DappMetadata = { name: string; description: string; icons: string[]; overrideUrl?: string };

export type Namespaces = { EIP155: "eip155"; WEBMAX: "webmax" };
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

export type WebmaxReadyResult = {
	supportedNamespaces: Namespace[];
	supportedChains: ChainedNamespace[];
};

export type WebmaxConnectResult = Prettify<WebmaxReadyResult & { accounts: { eip155: EthereumAddress[] } }>;

export type WebmaxMessageSchema = [
	/**
	 * @description Handshake message sent when popup is opened and returns supported namespaces and chains to dApp.
	 */
	{
		type: "notice";
		namespace: Namespaces["WEBMAX"];
		method: "webmax_ready";
		params?: undefined;
		result: WebmaxReadyResult;
	},
	/**
	 * @description Handshake message sent when popup is opened and returns supported namespaces and chains to dApp.
	 */
	{
		type: "approval";
		namespace: Namespaces["WEBMAX"];
		method: "webmax_connect";
		params?: undefined;
		result: WebmaxConnectResult;
	},
	/**
	 * @description Notice to dapp to close the window.
	 */
	{
		type: "notice";
		namespace: Namespaces["WEBMAX"];
		method: "webmax_closeWindow";
		params?: undefined;
		result: null;
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

export type WebmaxDefaultMessageSchema = [
	...WebmaxMessageSchema,
	...EthApprovalMessageSchema,
	...EthReadonlyMessageSchema,
];

export type SchemaNamespace<Schema extends AbstractMessageSchema> = Schema[number]["namespace"];

export type ExtractSchema<
	Schema extends AbstractMessageSchema,
	Type extends Schema[number]["type"] = Schema[number]["type"],
> = { [K in keyof Schema]: Schema[K]["type"] extends Type ? Schema[K] : never };
