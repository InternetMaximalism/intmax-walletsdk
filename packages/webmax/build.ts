import { exec } from "child_process";
import arg from "arg";
import { context } from "esbuild";
import type { BuildOptions } from "esbuild";
import { glob } from "glob";

const args = arg({ "--watch": Boolean });

const isWatch = args["--watch"];

const entryPoints = glob.sync("./src/**/*.ts", { ignore: [] });

const commonOptions: BuildOptions = {
	entryPoints,
	logLevel: "info",
	platform: "node",
};

const buildContext = await context({
	...commonOptions,
	bundle: true,
	outbase: "./src",
	outdir: "./dist/esm",
	format: "esm",
	plugins: [],
});

if (isWatch) {
	buildContext.watch();
	exec("tsc -w  --project tsconfig.build.json --emitDeclarationOnly");
} else {
	await buildContext.rebuild();
	await buildContext.dispose();
	await exec("tsc --project tsconfig.build.json --emitDeclarationOnly");
}
