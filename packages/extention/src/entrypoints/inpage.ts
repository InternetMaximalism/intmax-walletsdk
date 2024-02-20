import { initWebmaxProvider } from "@/core/inject";
import { defineUnlistedScript } from "wxt/sandbox";

export default defineUnlistedScript(() => {
	console.info("Webmax injected");
	initWebmaxProvider();
});
