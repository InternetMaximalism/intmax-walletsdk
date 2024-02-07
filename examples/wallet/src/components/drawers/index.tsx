import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useDrawerStore } from "@/stores/drawers";
import { Suspense, lazy } from "react";
import { Loading } from "../loading";

const ProfileDrawer = lazy(() => import("./profile-drawer"));
const TokenDrawer = lazy(() => import("./token-drawer"));
const OnboardingDrawer = lazy(() => import("./onboading-drawer"));

export const Drawers = () => {
	const { props, setDrawerProps, lock, setLock } = useDrawerStore();

	const restProps = {
		...{ open: !!props, lock, setLock },
		onOpenChange: (open: boolean) => !lock && setDrawerProps(open ? props : null),
	};

	return (
		<Drawer {...restProps} closeThreshold={lock ? Infinity : 0.25}>
			<DrawerContent>
				<div className="mx-auto w-full max-w-md">
					<Suspense fallback={<Loading className="h-48" />}>
						{props?.id === "profile" && <ProfileDrawer {...props} {...restProps} />}
						{props?.id === "token-detail" && <TokenDrawer {...props} {...restProps} />}
						{props?.id === "onboarding" && <OnboardingDrawer {...props} {...restProps} />}
					</Suspense>
				</div>
			</DrawerContent>
		</Drawer>
	);
};
