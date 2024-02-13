import { context } from "esbuild";

const esmBuild = () =>
	context({
		entryPoints: ["./src/index.ts"],
		platform: "browser",
		bundle: true,
		logLevel: "info",
		outbase: "./src",
		outdir: "./dist",
		minify: true,
	});

const ctx = await esmBuild();
ctx.watch();
