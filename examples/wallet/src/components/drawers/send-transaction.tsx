import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { DrawerProps } from "@/stores/drawers";
import { ArrowLeft } from "lucide-react";
import { FC } from "react";

const SendTransactionDrawer: FC<DrawerProps<"send-transaction">> = ({ back, previos, transaction }) => {
	return (
		<>
			<DrawerHeader className="flex items-center px-2">
				{previos && (
					<Button variant="ghost" size="icon" onClick={back} className="h-10 w-10">
						<ArrowLeft />
					</Button>
				)}
				<DrawerTitle className="flex-1 text-left">Transaction</DrawerTitle>
			</DrawerHeader>
		</>
	);
};

export default SendTransactionDrawer;
