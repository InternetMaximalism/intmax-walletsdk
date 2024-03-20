import { Button } from "@/components/ui/button";
import { createViemWalletClient } from "@/lib/viemClient";
import { DrawerProps } from "@/stores/drawers";
import { FC } from "react";
import { fromHex, isHex } from "viem";
import { mainnet } from "viem/chains";
import { DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { WebmaxDappInfo } from "../webmax-dappinfo";

const SignMessageDrawer: FC<DrawerProps<"sign-message">> = ({
	account,
	dappMetadata,
	data,
	onSign,
	onCancel,
	onOpenChange,
}) => {
	const handleCancel = () => {
		onOpenChange?.(false);
		onCancel?.();
	};

	const handleSignMessage = async () => {
		const client = createViemWalletClient(mainnet, account);
		const signature = await client.signMessage({ message: isHex(data) ? { raw: data } : data });
		onSign?.(signature);
		onOpenChange?.(false);
	};

	return (
		<>
			<DrawerHeader>
				<DrawerTitle>Sign Message</DrawerTitle>
			</DrawerHeader>

			<div className="px-4 space-y-2">
				{dappMetadata && <WebmaxDappInfo dappMetadata={dappMetadata} size="sm" />}

				<div className="space-y-2">
					<div className="font-semibold">Message</div>
					<ScrollArea className="h-48 overflow-hidden border p-4 rounded-md text-sm">
						<pre className="text-sm overscroll-none" data-vaul-no-drag>
							{data.startsWith("0x") ? fromHex(data, "string") : data}
						</pre>
						<ScrollBar className="overscroll-none" data-vaul-no-drag />
						<ScrollBar orientation="horizontal" className="overscroll-none" data-vaul-no-drag />
					</ScrollArea>
				</div>
			</div>
			<DrawerFooter className="grid grid-cols-2">
				<Button variant="outline" onClick={handleCancel}>
					Cancel
				</Button>
				<Button onClick={handleSignMessage}>Sign</Button>
			</DrawerFooter>
		</>
	);
};

export default SignMessageDrawer;
