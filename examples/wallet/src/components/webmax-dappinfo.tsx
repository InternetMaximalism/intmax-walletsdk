import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FC } from "react";
import { DappMetadata } from "webmax2";

export const WebmaxDappInfo: FC<{ dappMetadata: DappMetadata }> = ({ dappMetadata }) => {
	const { name, description, icons } = dappMetadata;

	return (
		<div className="px-2 py-4 gap-2 flex items-center rounded-md border">
			<Avatar className="w-12 h-12">
				<AvatarImage src={icons[0]} />
				<AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
			</Avatar>
			<div>
				<h2 className="text-lg font-semibold">{name}</h2>
				<p className="text-muted-foreground text-sm line-clamp-1">{description}</p>
			</div>
		</div>
	);
};
