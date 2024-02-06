import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getChainLogo } from "@/constants";
import { useAccount } from "@/hooks/account";
import { useBalances } from "@/hooks/balance";
import { useTokenWithChain } from "@/hooks/blockchain";
import { tokenKey } from "@/lib/blockchain/utils";
import { formatBalance, formatUsdBalance } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { FC, memo } from "react";

export const AssetList: FC<{ className?: string }> = memo(({ className }) => {
	const account = useAccount();
	const balances = useTokenWithChain(useBalances(account));

	return (
		<ScrollArea className={className}>
			<div className={cn("grid gap-0.5", className)}>
				{balances.map((balance) => (
					<div
						key={tokenKey(balance.token)}
						className="flex gap-2 items-center rounded-md hover:bg-muted focus:bg-muted px-2 py-2 transition-colors"
					>
						<div className="flex items-end">
							<Avatar className="h-10 w-10 bg-background">
								<AvatarImage src={balance.token.logoURI} alt={balance.token.symbol} />
								<AvatarFallback>{balance.token.symbol?.toUpperCase().slice(0, 2)}</AvatarFallback>
							</Avatar>
							<Avatar className="h-5 w-5 -ml-2.5 border-2 border-background z-10 bg-background">
								<AvatarImage src={getChainLogo(balance.chain)} alt={balance.chain?.name} />
								<AvatarFallback>{balance.chain?.name?.toUpperCase().slice(0, 2)}</AvatarFallback>
							</Avatar>
						</div>
						<div className="flex-1">
							<div className="text-sm font-medium leading-none">{balance.token.name}</div>
							<div className="text-sm text-muted-foreground">{`${formatBalance(balance)} ${balance.token.symbol}`}</div>
						</div>
						<div className="font-medium">{formatUsdBalance(balance)}</div>
					</div>
				))}
			</div>
			<ScrollBar orientation="vertical" />
		</ScrollArea>
	);
});
