import { HomeHeader } from "./header";

const WALLET_URL = "http://localhost:5173";

function HomePage() {
	return (
		<div className="grid grid-rows-[auto,1fr] w-full h-full">
			<HomeHeader />
			<div>
				<iframe title="Webmax Wallet" src={WALLET_URL} className="w-full h-full" />
			</div>
		</div>
	);
}

export default HomePage;
