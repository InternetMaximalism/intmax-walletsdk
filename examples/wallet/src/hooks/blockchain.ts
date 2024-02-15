import { fetchTransactionCost } from "@/lib/blockchain/transaction";
import { normalizeTxRequest, txRequestKey } from "@/lib/blockchain/utils";
import { createViemClient, createViemWalletClient } from "@/lib/viemClient";
import { useNetworksStore } from "@/stores/network";
import { InternalTxRequest, Token } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Account, Chain } from "viem";

export const useTokensWithChain = <T extends { token: Token }>(data: T[]): (T & { chain: Chain })[] => {
	const chains = useNetworksStore((state) => state.networks);
	const chainMap = useMemo(() => new Map(chains.map((chain) => [chain.id, chain])), [chains]);

	const result = useMemo(() => {
		return data.map((item) => ({ ...item, chain: chainMap.get(item.token.chainId) as Chain }));
	}, [data, chainMap]);

	return result;
};

export function useTokenWithChain(item: null): null;
export function useTokenWithChain<T extends { token: Token }>(item: T): T & { chain: Chain };
export function useTokenWithChain<T extends { token: Token }>(item: T | null): (T & { chain: Chain }) | null;
export function useTokenWithChain<T extends { token: Token }>(item: T | null): (T & { chain: Chain }) | null {
	const chains = useNetworksStore((state) => state.networks);
	const chainMap = useMemo(() => new Map(chains.map((chain) => [chain.id, chain])), [chains]);
	if (!item) return null;

	const chain = chainMap.get(item.token.chainId) as Chain;

	return { ...item, chain };
}

export const useTransactionCost = (transaction: InternalTxRequest | null) => {
	const chains = useNetworksStore((state) => state.networks);

	const result = useQuery({
		queryKey: ["transaction-cost", txRequestKey(transaction)],
		queryFn: async () => {
			if (!transaction) return null;
			const { chainId } = normalizeTxRequest(transaction);
			const chain = chains.find((c) => c.id === chainId);
			if (!chain) throw new Error("Invalid chain");

			const cost = await fetchTransactionCost(transaction, chain);
			return cost;
		},
		enabled: !!transaction,
	});

	return result;
};

export const useNonce = (account: Account, chain: Chain) => {
	const result = useQuery({
		queryKey: ["nonce", account.address],
		queryFn: async () => {
			const clinet = createViemClient(chain);
			const nonce = await clinet.getTransactionCount({
				address: account.address,
				blockTag: "pending",
			});
			return nonce;
		},
		enabled: !!account,
	});

	return result;
};

export const useSendTransaction = () => {
	const chains = useNetworksStore((state) => state.networks);

	const sendTransaction = async (transaction: InternalTxRequest) => {
		const { chainId, account, raw: request } = normalizeTxRequest(transaction);
		const chain = chains.find((c) => c.id === chainId);
		if (!chain) throw new Error("Invalid chain");

		const clinet = createViemWalletClient(chain, account);
		const txHash = await clinet.sendTransaction(request);
		return txHash;
	};

	return sendTransaction;
};

export const useSignTransaction = () => {
	const chains = useNetworksStore((state) => state.networks);

	const signTransaction = async (transaction: InternalTxRequest) => {
		const { chainId, account, raw: request } = normalizeTxRequest(transaction);
		const chain = chains.find((c) => c.id === chainId);
		if (!chain) throw new Error("Invalid chain");

		const clinet = createViemWalletClient(chain, account);
		const signed = await clinet.signTransaction(request);
		return signed;
	};

	return signTransaction;
};
