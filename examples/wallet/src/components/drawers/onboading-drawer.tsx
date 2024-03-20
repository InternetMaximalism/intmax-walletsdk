import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useCreateAccount } from "@/hooks/account";
import { useDownload } from "@/hooks/utils";
import { useAccountStore } from "@/stores/account";
import { DrawerProps } from "@/stores/drawers";
import { Glasses, KeySquare, Zap } from "lucide-react";
import { FC, useState } from "react";
import { Link } from "react-router-dom";

const CreatedWalletView: FC<{ mnemonic: string; setLock: (lock: boolean) => void }> = ({ mnemonic, setLock }) => {
	const { download } = useDownload();
	const [saved, setSaved] = useState(false);

	const handleSave = () => {
		setSaved(true);
		setLock(false);
		download("webmax_demo_wallet_key.txt", mnemonic);
	};

	return (
		<>
			<DrawerHeader className="text-left">
				<DrawerTitle>Wallet created 🎉</DrawerTitle>
				<DrawerDescription>
					Your wallet has been created. Please save the following mnemonic phrase in a safe place.
				</DrawerDescription>
			</DrawerHeader>

			<div className="px-4 pb-4">
				<button type="button" className="grid grid-cols-3 text-center border w-full rounded-md p-2">
					{mnemonic.split(" ").map((word, i) => (
						<span className="text-primary text-sm font-semibold">{`${i + 1}. ${word}`}</span>
					))}
				</button>
			</div>
			<DrawerFooter className="grid grid-cols-2">
				<DrawerClose asChild>
					<Button variant="outline" disabled={!saved}>
						Close
					</Button>
				</DrawerClose>
				<Button onClick={handleSave}>Download</Button>
			</DrawerFooter>
		</>
	);
};

const OnboardingDrawer: FC<DrawerProps<"onboarding">> = ({ setLock }) => {
	const mnemonic = useAccountStore((state) => state.mnemonic);
	const create = useCreateAccount();

	const handleCreateWallet = () => {
		setLock(true);
		create();
	};

	if (mnemonic) {
		return <CreatedWalletView mnemonic={mnemonic} setLock={setLock} />;
	}

	return (
		<>
			<DrawerHeader className="text-left">
				<DrawerTitle>Welcome to Demo Wallet</DrawerTitle>
				<DrawerDescription>
					This is a demo wallet for INTMAX WalletSDK{" "}
					<span className="text-destructive font-semibold">Never put assets in it. </span>
					There's also a DemoDapp that you can use.
				</DrawerDescription>
			</DrawerHeader>

			<DrawerFooter>
				<Button variant="outline" onClick={handleCreateWallet}>
					<Zap className="mr-2" />
					Create new wallet
				</Button>
				<DrawerClose asChild>
					<Button variant="outline" asChild>
						<Link to="/settings">
							<KeySquare className="mr-2" />
							Import existing wallet{" "}
						</Link>
					</Button>
				</DrawerClose>
				<DrawerClose asChild>
					<Button variant="outline">
						<Glasses className="mr-2" />
						Continue as ViewMode
					</Button>
				</DrawerClose>
			</DrawerFooter>
		</>
	);
};

export default OnboardingDrawer;
