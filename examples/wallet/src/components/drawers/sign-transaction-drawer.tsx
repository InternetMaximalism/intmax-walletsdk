import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useSignTransaction } from "@/hooks/blockchain";
import { DrawerProps } from "@/stores/drawers";
import { ArrowLeft } from "lucide-react";
import { FC, useState } from "react";
import { TransactionDetails } from "../transactions/transaction-details";
import { TransferDetails } from "../transactions/transfer-details";
import { WebmaxDappInfo } from "../webmax-dappinfo";

const SignTransactionDrawer: FC<DrawerProps<"sign-transaction">> = ({
	back,
	onOpenChange,
	previos,
	transaction,
	dappMetadata,
	onCancel,
	onSign,
}) => {
	const [loading, setLoading] = useState(false);
	const signTransaction = useSignTransaction();

	const handleSignTransaction = async () => {
		setLoading(true);
		const signature = await signTransaction(transaction);
		onSign?.(signature);
		onOpenChange(false);
	};

	return (
		<>
			<DrawerHeader className="flex items-center px-4">
				{previos && (
					<Button variant="ghost" size="icon" onClick={back} className="h-10 w-10" disabled={loading}>
						<ArrowLeft />
					</Button>
				)}
				<DrawerTitle className="flex-1 text-left">Sign Transaction</DrawerTitle>
			</DrawerHeader>
			<div className="px-4 space-y-4">
				{dappMetadata && <WebmaxDappInfo dappMetadata={dappMetadata} size="sm" />}
				{transaction.type === "token-transfer" && <TransferDetails transaction={transaction} />}
				<TransactionDetails transaction={transaction} />
			</div>
			<DrawerFooter className="grid grid-cols-2">
				<DrawerClose asChild>
					<Button disabled={loading} variant="outline" onClick={() => onCancel?.()}>
						Close
					</Button>
				</DrawerClose>
				<Button disabled={loading} onClick={handleSignTransaction}>
					Sign
				</Button>
			</DrawerFooter>
		</>
	);
};

export default SignTransactionDrawer;
