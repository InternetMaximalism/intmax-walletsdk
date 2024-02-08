import { InternalTxRequest } from "@/types";
import { Chain } from "viem";
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
