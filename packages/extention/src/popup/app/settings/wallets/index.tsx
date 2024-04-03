import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { WebmaxWallet } from "@/core/types";
import { useSettingsStore } from "@/popup/stores/settings";
import { useWalletStore } from "@/popup/stores/wallet";
import { PlusCircle } from "lucide-react";
import { SettingsHeader } from "../settings-header";
import { WalletDialog } from "./wallet-dialog";

function WalletSettingsPage() {
	const wallets = useWalletStore((state) => state.wallets);
	const setWallets = useWalletStore((state) => state.setWallets);
	const isTestMode = useSettingsStore((state) => state.isTestMode);

	const handleWalletChange = (before: WebmaxWallet | null, wallet: WebmaxWallet | null) => {
		if (!wallet) return;
		wallet.isTestMode = undefined;
		if (before) setWallets(wallets?.map((w) => (w.url === before.url ? wallet : w)) ?? [wallet]);
		else setWallets(wallets ? [...wallets, wallet] : [wallet]);
	};

	const handleWalletRemove = (wallet: WebmaxWallet) => {
		setWallets(wallets?.filter((w) => w.url !== wallet.url) ?? []);
	};

	return (
		<div className="flex flex-col">
			<SettingsHeader backTo="/" title="Manage Wallets" />
			<div className="grid p-2 gap-2">
				<h3 className="text-lg font-semibold">Webmax Wallets</h3>
				{wallets
					?.filter((wallet) => isTestMode || !wallet.isTestMode)
					.map((wallet) => (
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
									onWalletChange={(w) => handleWalletChange(wallet, w)}
									onRemove={() => handleWalletRemove(wallet)}
								>
									<Button variant="outline">Edit</Button>
								</WalletDialog>
							</div>
						</div>
					))}
				<WalletDialog wallet={null} onWalletChange={(w) => handleWalletChange(null, w)}>
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
