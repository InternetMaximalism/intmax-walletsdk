import { init } from "@/core/inject";
import { defineUnlistedScript } from "wxt/sandbox";

export default defineUnlistedScript(() => {
	console.info("Webmax injected");
	init();
});
