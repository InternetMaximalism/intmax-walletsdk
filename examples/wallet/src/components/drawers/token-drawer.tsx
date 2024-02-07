import { DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useTokenPriceHistory } from "@/hooks/token";
import { formatNumber } from "@/lib/format";
import { DrawerProps } from "@/stores/drawers";
import { FC } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";

const TokenDrawer: FC<DrawerProps<"token-detail">> = ({ token }) => {
	const history = useTokenPriceHistory(token, "1d");

	return (
		<>
			<DrawerHeader>
				<DrawerTitle>Token</DrawerTitle>
				<div className="w-full h-48">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={history.data?.history} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
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
				</div>
			</DrawerHeader>
		</>
	);
};

export default TokenDrawer;
