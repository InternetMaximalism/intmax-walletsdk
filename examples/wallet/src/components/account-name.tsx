import { ENSAccount } from "@/lib/blockchain/ens";
import { cn } from "@/lib/utils";
import { FC } from "react";

export const AccountName: FC<{ account: ENSAccount | null; hideView?: boolean; className?: string }> = ({
	account,
	hideView,
	className,
}) => {
	return (
		<span className={cn("inline-flex overflow-x-hidden", className)}>
			<span className="truncate">{account?.ens ?? account?.address}</span>
			{account?.type === "json-rpc" && !hideView && (
				<span className="ml-1 font-medium text-muted-foreground">(view)</span>
			)}
		</span>
	);
};
