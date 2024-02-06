import { AccountSwitcher } from "./account-switcher";
import { AssetList } from "./asset-list";
import { BalanceCard } from "./balance-card";
import { MainActions } from "./main-actions";

function HomePage() {
	return (
		<div className="p-2 pb-0 grid gap-4 grid-rows-[auto,auto,auto,1fr] max-h-full">
			<header className="flex justify-end">
				<AccountSwitcher />
			</header>
			<BalanceCard />
			<MainActions />
			<AssetList />
		</div>
	);
}

export default HomePage;
