import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { createViemWalletClient } from "@/lib/viemClient";
import { DrawerProps } from "@/stores/drawers";
import { useNetworksStore } from "@/stores/network";
import { ArrowLeft } from "lucide-react";
import { FC, useState } from "react";
import { Chain, TypedDataDefinition } from "viem";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { WebmaxDappInfo } from "../webmax-dappinfo";

const SignTransactionDrawer: FC<DrawerProps<"sign-typed-data">> = ({
	back,
	onOpenChange,
	data,
	account,
	chainId,
	dappMetadata,
	previos,
	onCancel,
	onSign,
}) => {
	const chains = useNetworksStore((state) => state.networks);
	const [loading, setLoading] = useState(false);

	const handleSignTypedData = async () => {
		setLoading(true);
		const chain = chains.find((c) => c.id === Number(chainId)) as Chain;
		const clinet = createViemWalletClient(chain, account);
		const signed = await clinet.signTypedData(data as TypedDataDefinition);
		onSign?.(signed);
		onOpenChange(false);
	};

	return (
		<>
			<DrawerHeader className="flex items-center px-4">
				{previos && (
					<Button variant="ghost" size="icon" onClick={back} className="h-10 w-10" disabled={loading}>
						<ArrowLeft />
					</Button>
				)}
				<DrawerTitle className="flex-1 text-left">Sign TypedData</DrawerTitle>
			</DrawerHeader>
			<div className="px-4 space-y-4">
				{dappMetadata && <WebmaxDappInfo dappMetadata={dappMetadata} size="sm" />}
				<ScrollArea
					className="h-48 bg-muted rounded-md p-2 text-muted-foreground overscroll-none border"
					data-vaul-no-drag
				>
					<pre className="text-sm overscroll-none" data-vaul-no-drag>
						{JSON.stringify(data, null, 2)}
					</pre>
					<ScrollBar className="overscroll-none" data-vaul-no-drag />
					<ScrollBar orientation="horizontal" className="overscroll-none" data-vaul-no-drag />
				</ScrollArea>
			</div>
			<DrawerFooter className="grid grid-cols-2">
				<DrawerClose asChild>
					<Button disabled={loading} variant="outline" onClick={() => onCancel?.()}>
						Close
					</Button>
				</DrawerClose>
				<Button disabled={loading} onClick={handleSignTypedData}>
					Sign
				</Button>
			</DrawerFooter>
		</>
	);
};

export default SignTransactionDrawer;
