import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useENSAccounts } from "@/hooks/account";
import { useNonce, useSendTransaction, useTokenWithChain, useTransactionCost } from "@/hooks/blockchain";
import { useTokenAmountWithPrice } from "@/hooks/token";
import { normalizeTxRequest } from "@/lib/blockchain/utils";
import { formatAmount, formatNumber, formatUsdAmount } from "@/lib/format";
import { DrawerProps } from "@/stores/drawers";
import { useNetworksStore } from "@/stores/network";
import { InternalTxRequest, PickInternalTxRequest } from "@/types";
import { ArrowLeft, ChevronsDown } from "lucide-react";
import { FC, useState } from "react";
import { Chain } from "viem";
import { AccountAvatar } from "../account-avatar";
import { AccountName } from "../account-name";
import { TokenAvatar } from "../token-avatar";

const TransferDetails: FC<{ transaction: PickInternalTxRequest<"token-transfer"> }> = ({ transaction }) => {
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

const TransactionSimulate: FC<{ transaction: InternalTxRequest }> = () => {
	return <></>;
};

const TransactionDetails: FC<{ transaction: InternalTxRequest }> = ({ transaction }) => {
	const chains = useNetworksStore((state) => state.networks);
	const txFee = useTransactionCost(transaction);
	const txCost = useTokenAmountWithPrice(txFee?.data?.estimatedCost ?? null);

	const { chainId } = normalizeTxRequest(transaction);
	const nonce = useNonce(transaction.account, chains.find((c) => c.id === chainId) as Chain);

	return (
		<div className="p-4 border rounded-md overflow-x-hidden space-y-2">
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

const SendTransactionDrawer: FC<DrawerProps<"send-transaction">> = ({
	back,
	onOpenChange,
	previos,
	transaction,
	onCancel,
	onSign,
}) => {
	const [loading, setLoading] = useState(false);
	const sendTransaciton = useSendTransaction();

	const handleSendTransaction = async () => {
		setLoading(true);
		const hash = await sendTransaciton(transaction);
		onSign?.(hash);
		onOpenChange(false);
	};

	return (
		<>
			<DrawerHeader className="flex items-center px-2">
				{previos && (
					<Button variant="ghost" size="icon" onClick={back} className="h-10 w-10" disabled={loading}>
						<ArrowLeft />
					</Button>
				)}
				<DrawerTitle className="flex-1 text-left">
					{transaction.type === "raw-request" ? "Transaction Request" : "Sending Token"}
				</DrawerTitle>
			</DrawerHeader>
			<div className="px-4 space-y-4">
				{transaction.type === "raw-request" && <TransactionSimulate transaction={transaction} />}
				{transaction.type === "token-transfer" && <TransferDetails transaction={transaction} />}
				<TransactionDetails transaction={transaction} />
			</div>
			<DrawerFooter className="grid grid-cols-2">
				<DrawerClose asChild>
					<Button disabled={loading} variant="outline" onClick={() => onCancel?.()}>
						Close
					</Button>
				</DrawerClose>
				<Button disabled={loading} onClick={handleSendTransaction}>
					Send
				</Button>
			</DrawerFooter>
		</>
	);
};

export default SendTransactionDrawer;
