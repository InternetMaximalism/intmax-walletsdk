import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getChainLogo } from "@/constants";
import { Token } from "@/types";
import { FC } from "react";
import { Chain } from "viem";

export const TokenAvatar: FC<{ token: Token; chain?: Chain | null; sizeRem?: number }> = ({
	token,
	chain,
	sizeRem = 2.5,
}) => {
	return (
		<div className="flex items-end">
			<Avatar className="bg-background" style={{ width: `${sizeRem}rem`, height: `${sizeRem}rem` }}>
				<AvatarImage src={token.logoURI} alt={token.symbol} />
				<AvatarFallback>{token.symbol?.toUpperCase().slice(0, 2)}</AvatarFallback>
			</Avatar>
			{chain && (
				<Avatar
					className="border-2 border-background z-10 bg-background"
					style={{ width: `${sizeRem / 2}rem`, height: `${sizeRem / 2}rem`, marginLeft: `-${sizeRem / 4}rem` }}
				>
					<AvatarImage src={getChainLogo(chain)} alt={chain?.name} />
					<AvatarFallback>{chain?.name?.toUpperCase().slice(0, 2)}</AvatarFallback>
				</Avatar>
			)}
		</div>
	);
};
