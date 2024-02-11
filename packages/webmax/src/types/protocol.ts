import type { AddEthereumChainParameter, TransactionRequest, WatchAssetParams } from "viem";

export type Namespaces = { EIP155: "eip155"; WEBMAX: "webmax" };
export type Namespace = Namespaces[keyof Namespaces];
export type ChainedNamespace<NS extends Namespace = Namespace> = `${NS}:${string}`;

export type EthereumAddress = `0x${string}`;
export type Hex = `0x${string}`;
export type Hash = `0x${string}`;

export type WalletHandleTypes = "approval" | "notice";
export type DappHandleTypes = "readonly";

export type AbstractMessageSchema = {
	type: WalletHandleTypes | DappHandleTypes;
	namespace: Namespace;
	method: string;
	params?: unknown;
	result?: unknown;
}[];

export type WebmaxHandshakeResult = {
	supportedNamespaces: Namespace[];
	supportedChains: ChainedNamespace[];
	accounts: { eip155: EthereumAddress[] };
};

export type WebmaxMessageSchema = [
	/**
	 * @description Handshake message sent when popup is opened and returns supported namespaces and chains to dApp.
	 */
	{
		type: "notice";
		namespace: Namespaces["WEBMAX"];
		method: "webmax_handshake";
		params?: undefined;
		result: WebmaxHandshakeResult;
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
		params: [transaction: TransactionRequest<string>];
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
		params: [transaction: TransactionRequest<string>];
		result: Hex;
	},
	{
		type: "approval";
		namespace: Namespaces["EIP155"];
		method: "eth_signTypedData_v4";
		params: [address: EthereumAddress, message: string];
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
		method: "wallet_switchEthereumChain";
		params: [chain: { chainId: string }];
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
];

export type WebmaxDefaultMessageSchema = [
	...WebmaxMessageSchema,
	...EthApprovalMessageSchema,
	...EthReadonlyMessageSchema,
];

export type SchemaNamespace<Schema extends AbstractMessageSchema> = Schema[number]["namespace"];

export type ExtractSchemaByType<
	Schema extends AbstractMessageSchema,
	Type extends Schema[number]["type"] = Schema[number]["type"],
> = Extract<Schema[number], { type: Type }>;
