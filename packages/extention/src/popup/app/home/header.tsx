import { Button } from "@/components/ui/button";
import { WalletSwitcher } from "./wallet-switcher";

export const HomeHeader = () => {
	return (
		<header className="border-b p-2 flex justify-between items-center">
			<WalletSwitcher />
			<Button size="sm">Settings</Button>
		</header>
	);
};
