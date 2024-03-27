import { defineBackground } from "wxt/sandbox";
import { startHandleRequest } from "./handleRequest";
import { setupContentScript } from "./setupContentScript";

export default defineBackground(() => {
	startHandleRequest();
	setupContentScript();
});
