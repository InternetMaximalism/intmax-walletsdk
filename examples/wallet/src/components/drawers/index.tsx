import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useDrawerStore } from "@/stores/drawers";
import { Suspense, lazy } from "react";
import { Loading } from "../loading";

const ProfileDrawer = lazy(() => import("./profile-drawer"));
const TokenDrawer = lazy(() => import("./token-drawer"));

export const Drawers = () => {
	const { props, setDrawerProps } = useDrawerStore();

	const restProps = { open: !!props, onOpenChange: (open: boolean) => setDrawerProps(open ? props : null) };

	return (
		<Drawer {...restProps}>
			<DrawerContent className="min-h-48">
				<Suspense fallback={<Loading />}>
					{props?.id === "profile" && <ProfileDrawer {...props} {...restProps} />}
					{props?.id === "token-detail" && <TokenDrawer {...props} {...restProps} />}
				</Suspense>
			</DrawerContent>
		</Drawer>
	);
};
