import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { FC } from "react";
import { DappMetadata } from "walletnext";

export const WebmaxDappInfo: FC<{ dappMetadata: DappMetadata; size?: "sm" | "default" }> = ({
	dappMetadata,
	size = "default",
}) => {
	const { name, description, icons } = dappMetadata;

	return (
		<div className="px-2 py-4 gap-2 flex items-center rounded-md border">
			<Avatar className={size === "default" ? "w-12 h-12" : "w-8 h-8"}>
				<AvatarImage src={icons?.[0]} />
				<AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
			</Avatar>
			<div>
				<h2 className={cn("font-semibold line-clamp-1")}>{name}</h2>
				{size === "default" && <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>}
			</div>
		</div>
	);
};
