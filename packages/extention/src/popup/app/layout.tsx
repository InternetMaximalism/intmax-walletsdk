import { Loading } from "@/components/loading";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { IS_POPUP, POPUP_SIZE } from "../constants";

function GlobalLayout() {
	return (
		<div style={IS_POPUP ? POPUP_SIZE : undefined}>
			<Suspense fallback={<Loading />}>
				<Outlet />
			</Suspense>
		</div>
	);
}

export default GlobalLayout;
