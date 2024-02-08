import { webmax } from "@/lib/webmax/webmax";
import { useLayoutEffect } from "react";

export const useWebmax = () => {
	useLayoutEffect(() => {
		console.log("useWebmax");

		webmax.on("webmax", (c) => {
			console.log("webmax", c);
		});

		webmax.ready();

		//return () => webmax.destruct();
	}, []);
};
