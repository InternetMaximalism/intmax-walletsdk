import { ENSAccount } from "@/lib/blockchain/ens";
import { FC } from "react";

export const AccountName: FC<{ account: ENSAccount | null }> = ({ account }) => {
	return (
		<span>
			<span className="truncate">{account?.ens ?? account?.address}</span>
			{account?.type === "json-rpc" && <span className="ml-1 font-medium text-muted-foreground">(view)</span>}
		</span>
	);
};
