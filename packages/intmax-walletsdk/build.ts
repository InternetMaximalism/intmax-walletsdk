import { exec } from "child_process";
import fs from "fs";
import path from "path";
import arg from "arg";
import { context } from "esbuild";
import type { Location, PartialMessage, Plugin, PluginBuild } from "esbuild";
import { glob } from "glob";
import sveltePreprocess from "svelte-preprocess";
import * as svelte from "svelte/compiler";
import { Warning } from "svelte/types/compiler/interfaces";

const args = arg({ "--watch": Boolean });

const isWatch = args["--watch"];

const entryPoints = glob.sync(["./src/**/*.ts", "./src/**/*.svelte"], { ignore: [] });

const sveltePlugin: Plugin = {
	name: "svelte",
	setup(build: PluginBuild) {
		const preprocess = sveltePreprocess({ sourceMap: true });

		build.onLoad({ filter: /\.svelte$/ }, async (args) => {
			const convertMessage = ({ message, start, end }: Warning): PartialMessage => {
				let location: Partial<Location> | undefined;
				if (start && end) {
					const lineText = source.split(/\r\n|\r|\n/g)[start.line - 1];
					const lineEnd = start.line === end.line ? end.column : lineText.length;
					location = {
						file: filename,
						line: start.line,
						column: start.column,
						length: lineEnd - start.column,
						lineText,
					};
				}
				return { text: message, location };
			};

			const source = await fs.promises.readFile(args.path, "utf8");
			const filename = path.relative(process.cwd(), args.path);

			try {
				const processed = await svelte.preprocess(source, preprocess, { filename });
				const { js, warnings } = svelte.compile(processed.code, { filename, css: "injected" });
				const contents = `${js.code}//# sourceMappingURL=${js.map.toUrl()}`;
				return { contents, warnings: warnings.map(convertMessage), loader: "js" };
			} catch (e) {
				return { errors: [convertMessage(e as Warning)] };
			}
		});

		build.onLoad({ filter: /\.ts$/ }, async (args) => {
			const source = await fs.promises.readFile(args.path, "utf8");
			return { contents: source.replace(/.svelte/g, ".js"), loader: "ts" };
		});
	},
};

const buildContext = await context({
	entryPoints,
	outbase: "./src",
	outdir: "./dist/esm",
	format: "esm",
	logLevel: "info",
	plugins: [sveltePlugin],
});

if (isWatch) {
	buildContext.watch();
	exec("tsc -w  --project tsconfig.build.json --emitDeclarationOnly");
} else {
	await buildContext.rebuild();
	await buildContext.dispose();
	await exec("tsc --project tsconfig.build.json --emitDeclarationOnly");
}
