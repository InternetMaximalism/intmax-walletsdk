import { browser } from "wxt/browser";

declare global {
	const chrome: {
		scripting: {
			registerContentScripts: (
				arg0: { id: string; matches: string[]; js: string[]; runAt: string; world: string }[],
			) => void;
		};
	};
}

export const setupContentScript = async () => {
	const registeredContentScripts = await browser.scripting.getRegisteredContentScripts();
	const inpageRegisteredContentScript = registeredContentScripts.find((cs) => cs.id === "inpage");
	try {
		if (!(inpageRegisteredContentScript || navigator.userAgent.toLowerCase().includes("firefox"))) {
			chrome.scripting.registerContentScripts([
				{
					id: "inpage",
					matches: ["file://*/*", "http://*/*", "https://*/*"],
					js: ["inpage.js"],
					runAt: "document_start",
					world: "MAIN",
				},
			]);
		}
	} catch (e) {
		console.error("failed to register content scripts", e);
	}
};
