import { WalletContainer } from "@/components/wallet-container";
import { useWalletStore } from "@/popup/stores/wallet";
import { HomeHeader } from "./header";

function HomePage() {
	const currentWallet = useWalletStore((state) => state.current);

	return (
		<div className="grid grid-rows-[auto,1fr] w-full h-full">
			<HomeHeader />
			<div>
				{currentWallet ? (
					<WalletContainer wallet={currentWallet} className="w-full h-full" />
				) : (
					<div className="flex items-center justify-center w-full h-full text-2xl text-gray-400">
						Select a wallet to connect
					</div>
				)}
			</div>
		</div>
	);
}

export default HomePage;
