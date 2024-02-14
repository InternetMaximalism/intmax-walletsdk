import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getChainLogo } from "@/constants";
import { useNonce, useTransactionCost } from "@/hooks/blockchain";
import { useTokenAmountWithPrice } from "@/hooks/token";
import { normalizeTxRequest } from "@/lib/blockchain/utils";
import { formatAmount, formatNumber, formatUsdAmount } from "@/lib/format";
import { useNetworksStore } from "@/stores/network";
import { InternalTxRequest } from "@/types";
import { FC } from "react";
import { Chain } from "viem";

export const TransactionDetails: FC<{ transaction: InternalTxRequest }> = ({ transaction }) => {
	const chains = useNetworksStore((state) => state.networks);
	const txFee = useTransactionCost(transaction);
	const txCost = useTokenAmountWithPrice(txFee?.data?.estimatedCost ?? null);

	const { chainId } = normalizeTxRequest(transaction);
	const chain = chains.find((c) => c.id === chainId) as Chain;
	const nonce = useNonce(transaction.account, chain);

	return (
		<div className="p-4 border rounded-md overflow-x-hidden space-y-2">
			<div className="flex justify-between">
				<div className="font-semibold">Chain</div>
				<div className="text-muted-foreground flex items-center gap-1">
					<Avatar className="w-5 h-5">
						<AvatarImage src={getChainLogo(chain)} />
					</Avatar>
					{chain.name}
				</div>
			</div>
			<div className="flex justify-between">
				<div className="font-semibold">Nonce</div>
				<div className="text-muted-foreground">{nonce.data}</div>
			</div>
			<div className="flex justify-between">
				<div className="font-semibold">Fee (USD)</div>
				<div className="text-muted-foreground">{formatUsdAmount(txCost)}</div>
			</div>
			<div className="flex justify-between">
				<div className="font-semibold">{`Fee (${txCost?.token.symbol ?? ""})`}</div>
				<div className="text-muted-foreground">{`${formatAmount(txCost)} ${txCost?.token.symbol ?? ""}`}</div>
			</div>
			<div className="flex justify-between">
				<div className="font-semibold">Gas Limit</div>
				<div className="text-muted-foreground">{formatNumber(Number(txFee.data?.gasLimit ?? 0), "TOKEN_LONG")}</div>
			</div>
		</div>
	);
};
