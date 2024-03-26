import { browser } from "wxt/browser";

export const setupContentScript = async () => {
	const registeredContentScripts = await browser.scripting.getRegisteredContentScripts();
	const inpageRegisteredContentScript = registeredContentScripts.find((cs) => cs.id === "inpage");
	try {
		if (!(inpageRegisteredContentScript || navigator.userAgent.toLowerCase().includes("firefox"))) {
			await chrome.scripting.registerContentScripts([
				{
					id: "inpage",
					matches: ["file://*/*", "http://*/*", "https://*/*"],
					js: ["/inpage.js"],
					runAt: "document_start",
					world: "MAIN",
				},
			]);
		}
	} catch (e) {
		console.error("failed to register content scripts", e);
	}
};
