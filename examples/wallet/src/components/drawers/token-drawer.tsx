import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTokenWithChain } from "@/hooks/blockchain";
import { useTokenBalanceWithPrice, useTokenPriceHistory } from "@/hooks/token";
import { formatBalance, formatNumber, formatUsdBalance } from "@/lib/format";
import { cn } from "@/lib/utils";
import { DrawerProps } from "@/stores/drawers";
import { PriceHistory } from "@/types";
import { ExternalLink } from "lucide-react";
import { FC, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { Loading } from "../loading";
import { TokenAvatar } from "../token-avatar";
import { badgeVariants } from "../ui/badge";

const TokenChart: FC<{ history: PriceHistory }> = ({ history }) => {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<LineChart data={history.history} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
				<YAxis type="number" domain={["auto", "auto"]} hide />
				<Tooltip
					content={({ active, payload }) => {
						if (active && payload && payload.length) {
							return (
								<div className="rounded-lg border bg-background p-2 shadow-sm">
									<span className="font-bold text-muted-foreground">
										{formatNumber(Number(payload[0].value), "USD_BALANCE")}
									</span>
								</div>
							);
						}

						return null;
					}}
				/>
				<Line
					type="monotone"
					dataKey="priceUsd"
					strokeWidth={2}
					activeDot={{ r: 8, style: { fill: "hsl(var(--primary))" } }}
					style={{ stroke: "hsl(var(--primary))" }}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};

const TokenDrawer: FC<DrawerProps<"token-detail">> = ({ account, token, open }) => {
	const [scale, setScale] = useState<"1d" | "7d" | "30d">("1d");
	const history = useTokenPriceHistory(token, scale);
	const balance = useTokenWithChain(useTokenBalanceWithPrice(account, token));

	const current = history.data?.history[history.data?.history.length - 1].priceUsd ?? 0;
	const explorer = balance?.chain?.blockExplorers?.default;
	const explorerName = explorer?.name ?? "Blockchain Explorer";
	const tokenExplorerUrl =
		explorer?.url && token.type === "erc20" ? `${explorer.url}/token/${token.address}` : explorer?.url ?? null;

	const handleSend = () => {
		open({ id: "send-input", transfer: { account, token } });
	};

	return (
		<>
			<DrawerHeader className="flex items-center overflow-x-hidden px-4">
				<TokenAvatar token={token} chain={balance?.chain} sizeRem={2.5} />
				<DrawerTitle className="text-start flex-1 truncate">{token.name}</DrawerTitle>
				<div className="text-xl font-semibold">{formatNumber(current, "USD_BALANCE")}</div>
			</DrawerHeader>
			{!history.isError && (
				<>
					<div className="w-full h-40 px-2 relative">
						{!history.data?.history && history.isLoading && <Loading />}
						{history.data?.history && <TokenChart history={history.data} />}
						<div className="absolute bottom-2 left-2 font-medium w-24">
							<Select value={scale} onValueChange={(value) => setScale(value as typeof scale)}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="1d">1 Day</SelectItem>
										<SelectItem value="7d">7 Days</SelectItem>
										<SelectItem value="30d">30 Days</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>
				</>
			)}
			<Separator />
			<div className="px-4 py-2">
				<div className="flex justify-between">
					<div className="text-base font-medium text-muted-foreground">Balance</div>
					<div className="text-base font-medium text-muted-foreground">Value</div>
				</div>
				<div className="flex justify-between">
					<div className="text-xl font-semibold">{`${formatBalance(balance)} ${token.symbol}`}</div>
					<div className="text-xl font-semibold">{formatUsdBalance(balance)}</div>
				</div>
			</div>

			<div className="px-2 gap-2">
				{tokenExplorerUrl && (
					<a href={tokenExplorerUrl} className={badgeVariants({ variant: "outline" })} target="_blank" rel="noreferrer">
						{`View on ${explorerName}`}
						<ExternalLink className="w-3 h-3 ml-1" />
					</a>
				)}
			</div>

			<DrawerFooter className={cn("grid", account.type === "json-rpc" ? "grid-cols-1" : "grid-cols-2")}>
				<DrawerClose>
					<Button className="w-full" variant="secondary">
						Close
					</Button>
				</DrawerClose>
				{account.type !== "json-rpc" && (
					<Button className="w-full" onClick={handleSend}>
						Send
					</Button>
				)}
			</DrawerFooter>
		</>
	);
};

export default TokenDrawer;
