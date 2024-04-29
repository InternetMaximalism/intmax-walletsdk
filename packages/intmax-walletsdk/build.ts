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
const addExtension = (extension = ".js", fileExtension = ".ts"): Plugin => ({
	name: "add-extension",
	setup(build: PluginBuild) {
		build.onResolve({ filter: /.*/ }, (args) => {
			if (args.importer) {
				const p = path.join(args.resolveDir, args.path);
				let tsPath = `${p}${fileExtension}`;

				let importPath = "";
				if (path.basename(args.importer).split(".")[0] === args.path) {
					importPath = args.path;
				} else if (fs.existsSync(tsPath)) {
					importPath = args.path + extension;
				} else {
					tsPath = path.join(args.resolveDir, args.path, `index${fileExtension}`);
					if (fs.existsSync(tsPath)) {
						importPath = `${args.path}/index${extension}`;
					}
				}

				return { path: importPath, external: true };
			}
		});
	},
});

const buildContext = await context({
	entryPoints,
	logLevel: "info",
	platform: "node",
	bundle: true,
	outbase: "./src",
	outdir: "./dist/esm",
	format: "esm",
	plugins: [addExtension(".js"), sveltePlugin],
});

if (isWatch) {
	buildContext.watch();
	exec("tsc -w  --project tsconfig.build.json --emitDeclarationOnly");
} else {
	await buildContext.rebuild();
	await buildContext.dispose();
	await exec("tsc --project tsconfig.build.json --emitDeclarationOnly");
}
