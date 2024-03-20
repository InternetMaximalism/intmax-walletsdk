import { Loading } from "@/components/loading";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { IS_POPUP, POPUP_SIZE } from "../constants";

const isCreatedWindow = window.location.search.includes("create=true");

function GlobalLayout() {
	return (
		<div style={IS_POPUP && !isCreatedWindow ? POPUP_SIZE : undefined} className={cn(isCreatedWindow && "h-[100dvh]")}>
			<Suspense fallback={<Loading />}>
				<Outlet />
			</Suspense>
		</div>
	);
}

export default GlobalLayout;
