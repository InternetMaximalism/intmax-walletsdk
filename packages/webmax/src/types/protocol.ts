import type { AddEthereumChainParameter, TransactionRequest, WatchAssetParams } from "viem";

export type Namespaces = { EIP155: "eip155"; WEBMAX: "webmax" };
export type Namespace = Namespaces[keyof Namespaces];
export type ChainedNamespace<NS extends Namespace = Namespace> = `${NS}:${string}`;

export type EthereumAddress = `0x${string}`;
export type Hex = `0x${string}`;
export type Hash = `0x${string}`;

export type AbstractMessageSchema = {
	namespace: Namespace;
	method: string;
	params?: unknown;
	result?: unknown;
};

export type WebmaxHandshakeResult = {
	supportedNamespaces: Namespace[];
	supportedChains: ChainedNamespace[];
	accounts: Record<Namespace, string[]>;
};

export type WebmaxMessageSchema = [
	/**
	 * @description Handshake message sent when popup is opened and returns supported namespaces and chains to dApp.
	 */
	{
		namespace: Namespaces["WEBMAX"];
		method: "webmax_handshake";
		params?: undefined;
		result: WebmaxHandshakeResult;
	},
	/**
	 * @description Forbidden message sent when dApp tries to call a method before walletconnect.
	 */
	{
		namespace: Namespaces["WEBMAX"];
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
		namespace: Namespaces["EIP155"];
		method: "eth_sendTransaction";
		params: [transaction: TransactionRequest<string>];
		result: Hash;
	},
	{
		namespace: Namespaces["EIP155"];
		method: "eth_sign";
		params: [address: EthereumAddress, data: Hex];
		result: Hex;
	},
	{
		namespace: Namespaces["EIP155"];
		method: "eth_signTransaction";
		params: [transaction: TransactionRequest<string>];
		result: Hex;
	},
	{
		namespace: Namespaces["EIP155"];
		method: "eth_signTypedData_v4";
		params: [address: EthereumAddress, message: string];
		result: Hex;
	},
	{
		namespace: Namespaces["EIP155"];
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
		namespace: Namespaces["EIP155"];
		method: "wallet_watchAsset";
		params: [asset: WatchAssetParams];
		result: null;
	},
];

export type EIP1193ReadonlyMessageSchema = [
	{
		namespace: Namespaces["EIP155"];
		method: "eth_accounts";
		params?: undefined;
		result: EthereumAddress[];
	},
	{
		namespace: Namespaces["EIP155"];
		method: "eth_chainId";
		params?: undefined;
		result: string;
	},
];

export type WalletClientMessageSchema = [...WebmaxMessageSchema, ...EIP1193MessageSchema];

export type DappMessageSchema = [...WebmaxMessageSchema, ...EIP1193MessageSchema, ...EIP1193ReadonlyMessageSchema];

export type MessageMethod<Schemas extends AbstractMessageSchema[], NS extends Namespace> = Extract<
	Schemas[number],
	{ namespace: NS }
>["method"];

export type MessageParams<
	Schemas extends AbstractMessageSchema[],
	NS extends Namespace,
	Method extends string,
> = Extract<Extract<Schemas[number], { namespace: NS; method: Method }>, { namespace: NS; method: Method }>["params"];

export type MessageResult<
	Schemas extends AbstractMessageSchema[],
	NS extends Namespace,
	Method extends string,
> = Extract<Extract<Schemas[number], { namespace: NS; method: Method }>, { namespace: NS; method: Method }>["result"];
