import { Outlet } from "react-router-dom";

function GlobalLayout() {
	return (
		<div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-muted sm:p-4 lg:p-6">
			<div className="mx-auto max-w-sm sm:border rounded-md bg-background h-full">
				<Outlet />
			</div>
		</div>
	);
}

export default GlobalLayout;
