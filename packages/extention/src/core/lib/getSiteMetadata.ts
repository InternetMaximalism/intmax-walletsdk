import { SiteMetadata } from "../types";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

export const getSiteMetadata = async (): Promise<SiteMetadata> => {
	if (document.readyState === "loading") {
		await new Promise((resolve) => window.addEventListener("DOMContentLoaded", resolve, { once: true }));
	}

	const host = location.host;
	const title =
		document.title ??
		$('meta[property="og:title"]')?.getAttribute("content") ??
		$('meta[name="title"]')?.getAttribute("content") ??
		"Untitled";
	const description =
		$('meta[name="description"]')?.getAttribute("content") ??
		$('meta[property="og:description"]')?.getAttribute("content") ??
		"No description";

	const icons = [...$$('head > link[rel~="icon"]'), ...$$('head > meta[itemprop="image"]')]
		.map((el) => el.getAttribute("href"))
		.filter((href): href is NonNullable<typeof href> => href !== null)
		.map((href) => new URL(href, location.href).href);

	return { host, name: title, description, icons };
};
