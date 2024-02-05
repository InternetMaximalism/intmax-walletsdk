import { AccountSwitcher } from "./account-switcher";

function HomePage() {
	return (
		<>
			<header className="flex p-2 justify-end">
				<AccountSwitcher />
			</header>
		</>
	);
}

export default HomePage;
