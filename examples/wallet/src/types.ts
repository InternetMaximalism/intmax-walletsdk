import { Account, Address, TransactionRequest } from "viem";

export type BaseToken = {
	chainId: number;
	decimals: number;
	symbol?: string;
	name?: string;
	logoURI?: string;
};

export type NativeToken = BaseToken & { type: "native" };
export type Erc20Token = BaseToken & { type: "erc20"; address: string };

export type Token = NativeToken | Erc20Token;

export type Amount = { token: Token; amount: bigint };
export type Balance = { token: Token; balance: bigint };
export type Price = { token: Token; priceUsd: number };
export type AmountWithPrice = Amount & Price;
export type BalanceWithPrice = Balance & Price;

export type InternalRpcUrl = { url: string };

export type PriceHistory = {
	token: Token;
	history: { timestamp: number; priceUsd: number }[];
};

export type InternalTxRequest =
	| { type: "raw-request"; account: Account; chainId: number; raw: TransactionRequest }
	| { type: "token-transfer"; account: Account; token: Token; to: Address; amount: bigint };

export type PickInternalTxRequest<T extends InternalTxRequest["type"]> = Extract<InternalTxRequest, { type: T }>;
