import { SiteMetadata } from "../types";

export const getPageMetadata = (): SiteMetadata => {
	const host = location.host;
	const title = document.title;
	const description = document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
	const icons = Array.from(document.querySelectorAll('link[rel="icon"]'))
		.map((el) => el.getAttribute("href"))
		.filter((href): href is NonNullable<typeof href> => href !== null)
		.map((href) => new URL(href, location.href).href);

	return { host, name: title, description, icons };
};
