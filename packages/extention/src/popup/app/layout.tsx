import { Loading } from "@/components/loading";
import { cn } from "@/lib/utils";
import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { IS_POPUP, POPUP_SIZE } from "../constants";
import { useSettingsStore } from "../stores/settings";

const isCreatedWindow = window.location.search.includes("create=true");

function GlobalLayout() {
	const theme = useSettingsStore((state) => state.theme);

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove("light", "dark");

		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
			root.classList.add(systemTheme);
			return;
		}

		root.classList.add(theme);
	}, [theme]);

	return (
		<div
			style={IS_POPUP && !isCreatedWindow ? POPUP_SIZE : undefined}
			className={cn(isCreatedWindow && "h-[100dvh]", "bg-background text-foreground")}
		>
			<Suspense fallback={<Loading />}>
				<Outlet />
			</Suspense>
		</div>
	);
}

export default GlobalLayout;
