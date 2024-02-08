import { Button } from "@/components/ui/button";
import { Sun } from "lucide-react";
import { FC } from "react";

export const ThemeSwitcher: FC = () => {
	return (
		<Button size="icon" variant="ghost">
			<Sun />
		</Button>
	);
};
