import { InternalTxRequest } from "@/types";
import { Account, Chain, RpcTransactionRequest, TransactionRequest } from "viem";
import { createViemClient } from "../viemClient";
import { getNativeToken, normalizeTxRequest } from "./utils";

export const fetchTransactionCost = async (transaction: InternalTxRequest, chain: Chain) => {
	const { account, chainId, raw: request } = normalizeTxRequest(transaction);
	if (chainId !== chain.id) throw new Error("Invalid chain");

	const client = createViemClient(chain);

	const feePerGas = await client.estimateFeesPerGas();
	const gasLimit = await client.estimateGas({ ...request, account });

	const totalFeePerGas =
		"gasPrice" in feePerGas ? feePerGas.gasPrice : feePerGas.maxFeePerGas + feePerGas.maxPriorityFeePerGas;

	const nativeToken = getNativeToken(chain);

	return {
		feePerGas,
		gasLimit,
		estimatedCost: { token: nativeToken, amount: gasLimit * (totalFeePerGas ?? 0n) },
	};
};

const rpcTransactionType = { "0x0": "legacy", "0x1": "eip2930", "0x2": "eip1559" } as const;

export const convertRpcReqToViemReq = (request: RpcTransactionRequest): TransactionRequest => {
	return {
		...request,
		type: request.type ? (rpcTransactionType[request.type] as "legacy") : undefined,
		nonce: request.nonce ? Number(request.nonce) : undefined,
		value: request.value ? BigInt(request.value) : undefined,
		gas: request.gas ? BigInt(request.gas) : undefined,
		gasPrice: request.gasPrice ? BigInt(request.gasPrice) : undefined,
		maxFeePerBlobGas: request.maxFeePerGas ? BigInt(request.maxFeePerGas) : undefined,
		maxFeePerGas: request.maxFeePerGas ? BigInt(request.maxFeePerGas) : undefined,
		maxPriorityFeePerGas: request.maxPriorityFeePerGas ? BigInt(request.maxPriorityFeePerGas) : undefined,
	} as TransactionRequest;
};

export const convertRpcReqToInternalReq = (params: {
	request: RpcTransactionRequest;
	account: Account;
	chainId: string;
}): InternalTxRequest => {
	const { request, account, chainId } = params;

	return {
		type: "raw-request",
		account,
		chainId: Number(chainId),
		raw: convertRpcReqToViemReq(request),
	};
};
