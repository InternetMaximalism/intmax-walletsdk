import { webmaxDappClient } from "webmax2/dapp";

const WALLET_URL = "http://localhost:5173";

const getPageMetadata = () => {
	const title = document.title;
	const description = document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
	const icons = Array.from(document.querySelectorAll('link[rel="icon"]'))
		.map((el) => el.getAttribute("href"))
		.filter((href): href is NonNullable<typeof href> => href !== null)
		.map((href) => new URL(href, location.href).href);

	return { name: title, description, icons };
};
const main = async () => {
	alert("Webmax Injected");

	const client = webmaxDappClient({
		wallet: { name: "webmax", url: WALLET_URL },
		metadata: getPageMetadata(),
		httpRpc: {
			"eip155:1": { url: "https://mainnet.infura.io/v3" },
			"eip155:137": { url: "https://rpc-mainnet.maticvigil.com/" },
		} as const,
	});

	// @ts-ignore
	window.ethereum.request = (params) => {
		return client.provider("eip155").request(params);
	};
};

main();
