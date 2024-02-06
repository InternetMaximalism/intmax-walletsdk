import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAccount } from "@/hooks/account";
import { useCopy, useShare } from "@/hooks/utils";
import { CopyIcon } from "lucide-react";
import { FC, useCallback } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

export const ProfileDrawer: FC<{
	open: boolean;
	onChange: (open: boolean) => void;
}> = ({ open, onChange }) => {
	const account = useAccount();
	const { share, isCanShare } = useShare();
	const { copy } = useCopy();

	const handleCopy = useCallback(() => {
		copy(account?.address || "");
		toast("Address copied to clipboard");
	}, [account, copy]);

	const handleShare = useCallback(() => {
		share({ text: account?.address });
	}, [account, share]);

	return (
		<Drawer open={open} onOpenChange={onChange}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Account Profile</DrawerTitle>
				</DrawerHeader>
				<div className="px-6">
					<div className="w-48 h-48 mx-auto overflow-hidden p-2 bg-white">
						<QRCode value={account?.address || ""} className="w-full h-full" />
					</div>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									type="button"
									className="text-xs w-full border py-3 px-0.5 rounded-md font-medium hover:bg-muted"
									onClick={handleCopy}
								>
									{account?.address}
								</button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Copy Address</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
				<DrawerFooter className="grid grid-cols-[1fr,1fr,auto] gap-2">
					<DrawerClose>
						<Button className="w-full" variant="secondary">
							Close
						</Button>
					</DrawerClose>
					{isCanShare && (
						<Button className="w-full" onClick={handleShare}>
							Share
						</Button>
					)}
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								{isCanShare ? (
									<Button size="icon" variant="outline" onClick={handleCopy}>
										<CopyIcon className="h-5 w-5" />
									</Button>
								) : (
									<Button onClick={handleCopy}>Copy</Button>
								)}
							</TooltipTrigger>
							<TooltipContent>
								<p>Copy Address</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};
