import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCopy, useShare } from "@/hooks/utils";
import { DrawerProps } from "@/stores/drawers";
import { CopyIcon } from "lucide-react";
import { FC, useCallback } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { AccountAvatar } from "../account-avatar";
import { AccountName } from "../account-name";

const ProfileDrawer: FC<DrawerProps<"profile">> = ({ account }) => {
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
		<>
			<DrawerHeader className="flex items-center overflow-x-hidden px-4">
				<AccountAvatar account={account} className="w-10 h-10" />
				<DrawerTitle className="text-start text-xl flex-1 overflow-x-hidden">
					<AccountName account={account} className="w-full" />
				</DrawerTitle>
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
		</>
	);
};

export default ProfileDrawer;
