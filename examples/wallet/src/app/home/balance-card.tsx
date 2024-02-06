import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccount } from "@/hooks/account";
import { useBalances } from "@/hooks/balance";
import { formatNumber } from "@/lib/format";
import { useMemo } from "react";
import { formatUnits } from "viem";

export const BalanceCard = () => {
	const account = useAccount();
	const balances = useBalances(account);

	const totalUsdBalance = useMemo(() => {
		return balances
			.map((balance) => +formatUnits(balance.balance, balance.token.decimals) * balance.priceUsd)
			.reduce((a, b) => a + b, 0);
	}, [balances]);

	return (
		<div className="border p-4 rounded-md bg-background">
			<h2 className="text-xld">Your Balance</h2>
			<div className="flex items-center">
				<div className="text-3xl font-bold flex-1">{formatNumber(totalUsdBalance, "USD_BALANCE")}</div>
				<Select value="usd">
					<SelectTrigger className="w-24 font-semibold">
						<SelectValue />
					</SelectTrigger>
					<SelectContent className="w-24 items-start">
						<SelectGroup>
							<SelectItem value="usd">USD</SelectItem>
							<SelectItem value="eth">ETH</SelectItem>
							<SelectItem value="btc">BTC</SelectItem>
							<SelectItem value="jpy">JPY</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};
