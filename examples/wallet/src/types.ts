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
