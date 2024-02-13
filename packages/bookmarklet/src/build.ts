/*
  For `build.ts`, further inspire @honojs/hono with inspire @kaze-style/react.
  https://github.com/honojs/hono/blob/main/build.ts
  https://github.com/taishinaritomi/kaze-style/blob/main/scripts/build.ts
  MIT License
  Copyright (c) 2024 inaridiy
*/

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
