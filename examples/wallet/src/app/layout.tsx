import { Loading } from "@/components/loading";
import { useAccountStore } from "@/stores/account";
import { useDrawerStore } from "@/stores/drawers";
import { Suspense, useLayoutEffect } from "react";
import { Outlet } from "react-router-dom";

function GlobalLayout() {
	const setDrawerProps = useDrawerStore((state) => state.setDrawerProps);
	const mnemonic = useAccountStore((state) => state.mnemonic);
	const privateKeys = useAccountStore((state) => state.privateKeys);

	useLayoutEffect(() => {
		if (!mnemonic && privateKeys.length === 0) {
			setDrawerProps({ id: "onboarding" });
		}
	}, [mnemonic, privateKeys, setDrawerProps]);

	return (
		<div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-muted sm:p-4 lg:p-6 flex items-center justify-center">
			<div className="w-full sm:max-w-sm sm:border sm:aspect-[1/2] rounded-md bg-background h-full sm:h-auto">
				<Suspense fallback={<Loading />}>
					<Outlet />
				</Suspense>
			</div>
		</div>
	);
}

export default GlobalLayout;
