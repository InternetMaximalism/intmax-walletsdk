import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const BalanceCard = () => {
	return (
		<div className="border p-4 rounded-md bg-background">
			<h2 className="text-xld">Your Balance</h2>
			<div className="flex items-center">
				<div className="text-3xl font-bold flex-1">$1,000.00</div>
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
