import { InternalTxRequest, NativeToken, PickInternalTxRequest, Token } from "@/types";
import { Address, Chain, decodeFunctionData, encodeFunctionData, erc20Abi } from "viem";

export function tokenKey(token: Token): string;
export function tokenKey(token: null): null;
export function tokenKey(token: Token | null): string | null;
export function tokenKey(token: Token | null) {
	if (!token) return null;
	return token.type === "native" ? String(token.chainId) : `${token.chainId}:${token.address}`;
}

export const findToken = (tokens: Token[], chainId: number, address?: Address) => {
	const token = tokens.find((t) => t.chainId === chainId && (t.type === "native" || t.address === address));
	if (!token) throw new Error("Invalid token");
	return token;
};

export const getNativeToken = (chain: Chain): NativeToken => ({
	type: "native",
	chainId: chain.id,
	...chain.nativeCurrency,
});

export const normalizeTxRequest = (transaction: InternalTxRequest): PickInternalTxRequest<"raw-request"> => {
	if (transaction.type === "raw-request") return transaction;

	if (transaction.type === "token-transfer") {
		const { token, account, to, amount } = transaction;

		if (token.type === "native") {
			return {
				type: "raw-request",
				account,
				chainId: token.chainId,
				raw: { from: account.address, to, value: amount },
			};
		}

		return {
			type: "raw-request",
			account,
			chainId: token.chainId,
			raw: {
				from: account.address,
				to: token.address as Address,
				data: encodeFunctionData({ abi: erc20Abi, functionName: "transfer", args: [to, amount] }),
			},
		};
	}

	throw new Error("Invalid transaction type");
};

export const txRequestKey = (transaction: InternalTxRequest | null) => {
	if (!transaction) return null;
	return JSON.stringify(normalizeTxRequest(transaction), (_, value) =>
		typeof value === "bigint" ? value.toString() : value,
	);
};

export type SimulatedTxAction =
	| { type: "approve"; token: Token; amount: bigint }
	| { type: "transfer"; token: Token; to: Address; amount: bigint }
	| { type: "contract-creation" };

export const staticSimulateTxRequest = (transaction: InternalTxRequest, tokens: Token[]): SimulatedTxAction[] => {
	if (transaction.type === "token-transfer") {
		const { token, to, amount } = transaction;
		return [{ type: "transfer", token, to, amount }];
	}

	if (transaction.type === "raw-request") {
		const { chainId, raw } = transaction;
		const actions: SimulatedTxAction[] = [];

		if (!raw.to) return [{ type: "contract-creation" }];
		if (raw.value !== undefined) {
			const token = findToken(tokens, chainId);
			actions.push({ type: "transfer", token, to: raw.to, amount: BigInt(raw.value) });
		}

		if (!raw.data) return actions;

		try {
			const decoded = decodeFunctionData({ abi: erc20Abi, data: raw.data });
			if (decoded.functionName === "transfer") {
				const token = findToken(tokens, chainId, decoded.args[0]);
				actions.push({ type: "transfer", token, to: decoded.args[0], amount: BigInt(decoded.args[1]) });
			} else if (decoded.functionName === "approve") {
				const token = findToken(tokens, chainId, decoded.args[0]);
				actions.push({ type: "approve", token, amount: BigInt(decoded.args[1]) });
			}
		} catch {}

		return actions;
	}

	return [];
};
