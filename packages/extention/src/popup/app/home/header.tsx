import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { WalletSwitcher } from "./wallet-switcher";

export const HomeHeader = () => {
	return (
		<header className="border-b p-2 flex justify-between items-center">
			<WalletSwitcher />
			<Button size="icon" variant="ghost">
				<Menu />
			</Button>
		</header>
	);
};
