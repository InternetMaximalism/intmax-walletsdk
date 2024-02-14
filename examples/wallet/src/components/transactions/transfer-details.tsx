import { useENSAccounts } from "@/hooks/account";
import { useTokenWithChain } from "@/hooks/blockchain";
import { useTokenAmountWithPrice } from "@/hooks/token";
import { formatAmount, formatUsdAmount } from "@/lib/format";
import { PickInternalTxRequest } from "@/types";
import { ChevronsDown } from "lucide-react";
import { FC } from "react";
import { AccountAvatar } from "../account-avatar";
import { AccountName } from "../account-name";
import { TokenAvatar } from "../token-avatar";

export const TransferDetails: FC<{ transaction: PickInternalTxRequest<"token-transfer"> }> = ({ transaction }) => {
	const { chain } = useTokenWithChain(transaction);
	const amountWithPrice = useTokenAmountWithPrice(transaction);

	const [receiver] = useENSAccounts([{ address: transaction.to, type: "json-rpc" }]);

	return (
		<div className="p-4 border rounded-md overflow-x-hidden">
			<div className="flex items-center gap-2">
				<TokenAvatar token={transaction.token} chain={chain} />
				<div className="text-lg font-semibold flex-1 truncate">{transaction.token.name}</div>
				<div className="text-right">
					<div className="font-semibold">{`${formatAmount(transaction)} ${transaction.token.symbol}`}</div>
					<div className="text-muted-foreground text-sm">{formatUsdAmount(amountWithPrice)}</div>
				</div>
			</div>
			<div className="flex justify-center">
				<ChevronsDown className="w-6 h-6" />
			</div>
			<div className="flex items-center gap-2">
				<AccountAvatar account={receiver.data ?? null} className="w-10 h-10" />
				<AccountName hideView account={receiver.data ?? null} className="flex-1 text-lg font-semibold" />
				<div className="px-4 text-center font-semibold border rounded-full">Receiver</div>
			</div>
		</div>
	);
};
