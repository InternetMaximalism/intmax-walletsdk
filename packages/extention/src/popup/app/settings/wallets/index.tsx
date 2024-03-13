import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { WebmaxWallet } from "@/core/types";
import { useWalletStore } from "@/popup/stores/wallet";
import { PlusCircle } from "lucide-react";
import { SettingsHeader } from "../settings-header";
import { WalletDialog } from "./wallet-dialog";

function WalletSettingsPage() {
	const wallets = useWalletStore((state) => state.wallets);
	const setWallets = useWalletStore((state) => state.setWallets);

	const handleWalletChange = (wallet: WebmaxWallet | null) => {
		if (!wallet) return;
		const existingWallet = wallets?.find((w) => w.url === wallet.url);
		if (existingWallet) setWallets(wallets?.map((w) => (w.url === wallet.url ? wallet : w)) ?? []);
		else setWallets([...(wallets ?? []), wallet]);
	};

	const handleWalletRemove = (wallet: WebmaxWallet) => {
		setWallets(wallets?.filter((w) => w.url !== wallet.url) ?? []);
	};

	return (
		<div className="flex flex-col">
			<SettingsHeader backTo="/" title="Manage Wallets" />
			<div className="grid p-2 gap-2">
				<h3 className="text-lg font-semibold">Webmax Wallets</h3>
				{wallets?.map((wallet) => (
					<div key={wallet.url} className="flex items-center gap-2 p-2 overflow-x-hidden">
						<div>
							<Avatar>
								{wallet.logoUrl && <AvatarImage src={wallet.logoUrl} />}
								<AvatarFallback>{wallet.name.slice(0, 2)}</AvatarFallback>
							</Avatar>
						</div>
						<div className="flex-1 overflow-hidden">
							<div className="font-semibold truncate">{wallet.name}</div>
							<div className="text-sm text-muted-foreground truncate">{wallet.url}</div>
						</div>
						<div>
							<WalletDialog
								wallet={wallet}
								onWalletChange={handleWalletChange}
								onRemove={() => handleWalletRemove(wallet)}
							>
								<Button variant="outline">Edit</Button>
							</WalletDialog>
						</div>
					</div>
				))}
				<WalletDialog wallet={null} onWalletChange={handleWalletChange}>
					<Button variant="outline">
						<PlusCircle className="mr-2" />
						Add New Wallet
					</Button>
				</WalletDialog>
			</div>
		</div>
	);
}

export default WalletSettingsPage;
