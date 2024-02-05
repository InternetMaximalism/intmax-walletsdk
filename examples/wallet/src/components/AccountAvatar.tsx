import { cn } from "@/lib/utils";
import BoringAvatar from "boring-avatars";
import { FC } from "react";
import { Account, Address } from "viem";
import { Avatar, AvatarFallback } from "./ui/avatar";

export const AccountAvatar: FC<{
	account: Account | Address | null;
	className: string;
}> = ({ account, className }) => {
	const address = account && (typeof account === "string" ? account : account.address);

	if (!address) {
		return (
			<Avatar className={className}>
				<AvatarFallback>IN</AvatarFallback>
			</Avatar>
		);
	}

	return (
		<div className={cn("overflow-hidden shrink-0", className)}>
			<BoringAvatar name={address} variant="marble" size="100%" />
		</div>
	);
};
