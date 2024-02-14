import { useBalances } from "@/hooks/balance";
import { staticSimulateTxRequest } from "@/lib/blockchain/utils";
import { InternalTxRequest } from "@/types";
import { FC, useMemo } from "react";

export const TransactionSimulate: FC<{ transaction: InternalTxRequest }> = ({ transaction }) => {
	const balances = useBalances(transaction.account);
	const simulates = useMemo(() => {
		const result = staticSimulateTxRequest(
			transaction,
			balances.map((b) => b.token),
		);
		return result;
	}, [balances, transaction]);

	if (simulates.length === 0) return <></>;

	return (
		<div className="p-4 border rounded-md overflow-x-hidden">
			{simulates.map((simulate) => (
				<div key={simulate.toString()} className="flex justify-between">
					<div className="font-semibold">{simulate.type}</div>
					<div className="text-muted-foreground">{simulate.toString()}</div>
				</div>
			))}
		</div>
	);
};
