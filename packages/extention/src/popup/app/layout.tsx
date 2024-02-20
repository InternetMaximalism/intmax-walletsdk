import { Loading } from "@/components/loading";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

function GlobalLayout() {
	return (
		<Suspense fallback={<Loading />}>
			<Outlet />
		</Suspense>
	);
}

export default GlobalLayout;
