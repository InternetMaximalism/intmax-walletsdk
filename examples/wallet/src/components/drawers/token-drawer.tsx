import { DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { DrawerProps } from "@/stores/drawers";
import { FC } from "react";

const TokenDrawer: FC<DrawerProps<"token-detail">> = ({ token }) => {
	return (
		<>
			<DrawerHeader>
				<DrawerTitle>Token</DrawerTitle>
			</DrawerHeader>
		</>
	);
};

export default TokenDrawer;
