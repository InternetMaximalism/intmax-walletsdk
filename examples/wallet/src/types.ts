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

export type Balance = { token: Token; balance: bigint };
export type Price = { token: Token; priceUsd: number };
export type BalanceWithPrice = Balance & Price;

export type InternalRpcUrl = { url: string };

export type PriceHistory = {
	token: Token;
	history: { timestamp: number; priceUsd: number }[];
};

export type InternalTransactionRequest =
	| { type: "raw-request"; raw: TransactionRequest }
	| { type: "token-transfer"; token: Token; account: Account; to: Address | string; amount: bigint };
