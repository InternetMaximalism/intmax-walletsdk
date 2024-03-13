import { SiteMetadata } from "../types";

export const getSiteMetadata = (): SiteMetadata => {
	const host = location.host;
	const title =
		document.title ??
		document.querySelector('meta[property="og:title"]')?.getAttribute("content") ??
		document.querySelector('meta[name="title"]')?.getAttribute("content") ??
		"Untitled";
	const description =
		document.querySelector('meta[name="description"]')?.getAttribute("content") ??
		document.querySelector('meta[property="og:description"]')?.getAttribute("content") ??
		"No description";

	const icons = [
		...document.querySelectorAll('head > link[rel~="icon"]'),
		...document.querySelectorAll('head > meta[itemprop="image"]'),
	]
		.map((el) => el.getAttribute("href"))
		.filter((href): href is NonNullable<typeof href> => href !== null)
		.map((href) => new URL(href, location.href).href);

	return { host, name: title, description, icons };
};
