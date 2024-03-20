import { DrawerProps } from "@/stores/drawers";
import { FC } from "react";
import { Button } from "../ui/button";
import { DrawerClose, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { WebmaxDappInfo } from "../webmax-dappinfo";
import { WebmaxHost } from "../webmax-host";

const WebmaxConnectDrawer: FC<DrawerProps<"webmax-connect">> = ({
	host,
	dappMetadata,
	onCancel,
	onConnect,
	onOpenChange,
}) => {
	const handleConnect = () => {
		onConnect();
		onOpenChange(false);
	};

	return (
		<>
			<DrawerHeader className="flex px-4">
				<DrawerTitle>Wallet Connect Request</DrawerTitle>
			</DrawerHeader>
			<div className="px-4 space-y-2">
				<WebmaxDappInfo dappMetadata={dappMetadata} />
				<WebmaxHost host={host} />
			</div>
			<DrawerFooter className="grid grid-cols-2">
				<DrawerClose asChild>
					<Button variant="outline" onClick={onCancel}>
						Reject
					</Button>
				</DrawerClose>
				<Button onClick={handleConnect}>Connect</Button>
			</DrawerFooter>
		</>
	);
};

export default WebmaxConnectDrawer;
