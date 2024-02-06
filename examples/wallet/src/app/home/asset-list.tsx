import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAccount } from "@/hooks/account";
import { useBalances } from "@/hooks/balance";
import { cn } from "@/lib/utils";
import { FC } from "react";

export const AssetList: FC<{ className: string }> = ({ className }) => {
	const account = useAccount();
	const balances = useBalances(account);

	return (
		<ScrollArea className={cn(className)}>
			<ScrollBar orientation="vertical" />
		</ScrollArea>
	);
};
