import { Loading } from "@/components/loading";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

function GlobalLayout() {
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
