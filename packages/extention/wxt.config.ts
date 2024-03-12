import react from "@vitejs/plugin-react";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	srcDir: "src",
	vite: () => ({ plugins: [react()] }),
	imports: false,
	manifest: {
		permissions: ["activeTab", "clipboardWrite", "scripting", "storage", "tabs", "unlimitedStorage", "notifications"],
		web_accessible_resources: [
			{
				resources: ["inpage.js"],
				matches: ["<all_urls>"],
			},
		],
		// content_security_policy: {
		// 	extension_pages: "frame-ancestors 'none'; script-src 'self'; object-src 'self'; connect-src 'self'",
		// },
	},
});
