import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useDrawer } from "@/hooks/drawer";
import { useDrawerStore } from "@/stores/drawers";
import { Suspense, lazy } from "react";
import { Loading } from "../loading";

const ProfileDrawer = lazy(() => import("./profile-drawer"));
const TokenDrawer = lazy(() => import("./token-drawer"));
const OnboardingDrawer = lazy(() => import("./onboading-drawer"));
const SendInputDrawer = lazy(() => import("./send-input-drawer"));
const SendTransactionDrawer = lazy(() => import("./send-transaction-drawer"));
const SignTransactionDrawer = lazy(() => import("./sign-transaction-drawer"));
const SignMessageDrawer = lazy(() => import("./sign-message-drawer"));
const SignTypedDataDrawer = lazy(() => import("./sign-typed-data-drawer"));
const WebmaxConnectDrawer = lazy(() => import("./webmax-connect-drawer"));

export const Drawers = () => {
	const { open, back } = useDrawer();
	const { props, setDrawerProps, lock, setLock } = useDrawerStore();

	const restProps = {
		...{ lock, setLock, back, open, previos: props?.previos },
		onOpenChange: (open: boolean) => {
			if (open) return;
			setDrawerProps(null);
			setLock(false);
		},
	};

	return (
		<Drawer open={!!props} onOpenChange={restProps.onOpenChange} closeThreshold={lock ? Infinity : 0.25}>
			<DrawerContent>
				<div className="mx-auto w-full max-w-md">
					<Suspense fallback={<Loading className="h-48" />}>
						{props?.id === "profile" && <ProfileDrawer {...props} {...restProps} />}
						{props?.id === "token-detail" && <TokenDrawer {...props} {...restProps} />}
						{props?.id === "onboarding" && <OnboardingDrawer {...props} {...restProps} />}
						{props?.id === "send-input" && <SendInputDrawer {...props} {...restProps} />}
						{props?.id === "send-transaction" && <SendTransactionDrawer {...props} {...restProps} />}
						{props?.id === "sign-transaction" && <SignTransactionDrawer {...props} {...restProps} />}
						{props?.id === "sign-message" && <SignMessageDrawer {...props} {...restProps} />}
						{props?.id === "sign-typed-data" && <SignTypedDataDrawer {...props} {...restProps} />}
						{props?.id === "webmax-connect" && <WebmaxConnectDrawer {...props} {...restProps} />}
					</Suspense>
				</div>
			</DrawerContent>
		</Drawer>
	);
};
