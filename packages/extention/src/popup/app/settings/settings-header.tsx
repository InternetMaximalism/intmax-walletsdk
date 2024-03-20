import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";

export const SettingsHeader: FC<{
	backTo: string;
	title: ReactNode;
}> = ({ backTo, title }) => {
	return (
		<header className="border-b p-2 flex items-center gap-2">
			<Button size="icon" variant="ghost" asChild>
				<Link to={backTo}>
					<ArrowLeft />
				</Link>
			</Button>
			<h2 className="text-lg font-semibold">{title}</h2>
		</header>
	);
};
