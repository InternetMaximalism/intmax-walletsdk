import react from "@vitejs/plugin-react";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	srcDir: "src",
	vite: () => ({ plugins: [react()] }),
	imports: false,
	manifest: {
		name: "INTMAX Wallet",
		version: "1.0.2",
		permissions: ["activeTab", "scripting", "storage", "tabs", "unlimitedStorage"],
		web_accessible_resources: [
			{
				resources: ["inpage.js"],
				matches: ["<all_urls>"],
			},
		],
		host_permissions: ["<all_urls>"],
	},
});
