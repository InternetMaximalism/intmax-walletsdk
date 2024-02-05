import { AccountSwitcher } from "./account-switcher";
import { BalanceCard } from "./balance-card";
import { MainActions } from "./main-actions";

function HomePage() {
	return (
		<div className="p-2 grid gap-4">
			<header className="flex justify-end">
				<AccountSwitcher />
			</header>
			<BalanceCard />
			<MainActions />
		</div>
	);
}

export default HomePage;
