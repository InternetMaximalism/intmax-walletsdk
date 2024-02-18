import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	vite: () => ({ plugins: [react()] }),
	imports: false,
});
