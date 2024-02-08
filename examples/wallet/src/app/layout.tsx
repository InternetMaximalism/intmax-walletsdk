import { Loading } from "@/components/loading";
import { useAccountStore } from "@/stores/account";
import { useDrawerStore } from "@/stores/drawers";
import { Suspense, useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Drawers } from "@/components/drawers";
import { Toaster } from "@/components/ui/sonner";
import { useWebmax } from "@/hooks/webmax";

function GlobalLayout() {
	useWebmax();

	const setDrawerProps = useDrawerStore((state) => state.setDrawerProps);
	const mnemonic = useAccountStore((state) => state.mnemonic);
	const privateKeys = useAccountStore((state) => state.privateKeys);

	const { pathname } = useLocation();

	useLayoutEffect(() => {
		if (pathname.includes("account")) return;

		if (!mnemonic && privateKeys.length === 0) {
			setDrawerProps({ id: "onboarding" });
		}
	}, [mnemonic, privateKeys, pathname, setDrawerProps]);

	return (
		<>
			<Toaster />
			<Drawers />
			<div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-muted sm:p-4 lg:p-6 flex items-center justify-center">
				<div className="w-full sm:max-w-sm sm:border sm:aspect-[1/2] rounded-md bg-background h-full sm:h-auto">
					<Suspense fallback={<Loading />}>
						<Outlet />
					</Suspense>
				</div>
			</div>
		</>
	);
}

export default GlobalLayout;
