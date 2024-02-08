import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import { FC } from "react";

export const Loading: FC<{
	className?: string;
}> = ({ className }) => {
	return (
		<div className={cn("w-full h-full flex items-center justify-center", className)}>
			<Loader2Icon className="text-muted-foreground h-6 w-6 animate-spin" />
		</div>
	);
};
