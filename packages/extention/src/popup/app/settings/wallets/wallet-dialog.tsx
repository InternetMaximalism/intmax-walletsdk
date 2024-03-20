import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WebmaxWallet } from "@/core/types";
import { cn } from "@/lib/utils";
import { FC, ReactNode, useState } from "react";

export const WalletDialog: FC<{
	children: ReactNode;
	wallet: WebmaxWallet | null;
	onWalletChange: (wallet: WebmaxWallet | null) => void;
	onRemove?: () => void;
}> = ({ children, wallet: defaultWallet, onWalletChange, onRemove }) => {
	const [wallet, setWallet] = useState<Partial<WebmaxWallet>>(defaultWallet ?? {});

	const isValidated = wallet?.name && wallet?.url;

	const handleSave = () => {
		if (isValidated) {
			onWalletChange(wallet as WebmaxWallet);
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Wallet Config</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid w-full max-w-sm items-center gap-1.5">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							placeholder="Wallet Display Name"
							value={wallet?.name ?? ""}
							onChange={(e) => setWallet({ ...wallet, name: e.target.value })}
						/>
					</div>
					<div className="grid w-full max-w-sm items-center gap-1.5">
						<Label htmlFor="logo">Logo</Label>
						<Input
							id="logo"
							placeholder="Logo URL (optional)"
							value={wallet?.logoUrl ?? ""}
							onChange={(e) => setWallet({ ...wallet, logoUrl: e.target.value })}
						/>
					</div>
					<div className="grid w-full max-w-sm items-center gap-1.5">
						<Label htmlFor="url">URL</Label>
						<Input
							id="url"
							placeholder="Wallet URL"
							value={wallet?.url ?? ""}
							onChange={(e) => setWallet({ ...wallet, url: e.target.value })}
						/>
					</div>
				</div>
				<DialogFooter className={cn("grid gap-2", onRemove && "grid-cols-2")}>
					{onRemove && (
						<DialogClose asChild>
							<Button type="button" variant="destructive" onClick={onRemove}>
								Remove
							</Button>
						</DialogClose>
					)}
					<DialogClose asChild>
						<Button type="button" disabled={!isValidated} onClick={handleSave}>
							Save
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
