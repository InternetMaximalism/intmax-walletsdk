import { ENSAccount } from "@/lib/blockchain/ens";
import { cn } from "@/lib/utils";
import BoringAvatar from "boring-avatars";
import { FC } from "react";
import { Account, Address } from "viem";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const AccountAvatar: FC<{
	account: ENSAccount | Account | Address | null;
	className: string;
}> = ({ account, className }) => {
	const name = account && typeof account !== "string" && "ens" in account ? account.ens : null;
	const avatar = account && typeof account !== "string" && "avatar" in account ? account.avatar : null;
	const address = account && (typeof account === "string" ? account : account.address);

	if (avatar || !address) {
		return (
			<Avatar className={className}>
				<AvatarImage src={avatar ?? ""} alt={name ?? "account"} />
				<AvatarFallback delayMs={500}>
					{name?.toUpperCase().slice(0, 2) ?? address?.toUpperCase().slice(0, 2) ?? "??"}
				</AvatarFallback>
			</Avatar>
		);
	}

	return (
		<div className={cn("overflow-hidden shrink-0", className)}>
			<BoringAvatar name={address} variant="marble" size="100%" />
		</div>
	);
};
