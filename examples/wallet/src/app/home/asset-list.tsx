import { TokenAvatar } from "@/components/token-avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAccount } from "@/hooks/account";
import { useBalances } from "@/hooks/balance";
import { useTokensWithChain } from "@/hooks/blockchain";
import { useDrawer } from "@/hooks/drawer";
import { tokenKey } from "@/lib/blockchain/utils";
import { formatBalance, formatUsdBalance } from "@/lib/format";
import { cn } from "@/lib/utils";
import { BalanceWithPrice } from "@/types";
import { FC, memo } from "react";
import { Chain } from "viem";

const AssetListItem: FC<{
	balance: BalanceWithPrice & { chain: Chain };
}> = memo(({ balance }) => {
	const account = useAccount();
	const { open } = useDrawer();

	return (
		<button
			type="button"
			className="flex gap-2 items-center rounded-md hover:bg-muted focus:bg-muted px-2 py-2 transition-colors overflow-x-hidden"
			onClick={() => account && open({ id: "token-detail", account, token: balance.token })}
		>
			<TokenAvatar token={balance.token} chain={balance.chain} sizeRem={2.5} />
			<div className="flex-1 text-start truncate">
				<div className="text-sm font-medium leading-none">{balance.token.name}</div>
				<div className="text-sm text-muted-foreground">{`${formatBalance(balance)} ${balance.token.symbol}`}</div>
			</div>
			<div className="font-medium">{formatUsdBalance(balance)}</div>
		</button>
	);
});

export const AssetList: FC<{ className?: string }> = memo(({ className }) => {
	const account = useAccount();
	const balances = useTokensWithChain(useBalances(account));

	return (
		<ScrollArea className={className}>
			<div className={cn("grid gap-0.5", className)}>
				{balances.map((balance) => (
					<AssetListItem key={tokenKey(balance.token)} balance={balance} />
				))}
			</div>
			<ScrollBar orientation="vertical" />
		</ScrollArea>
	);
});
