import { ethereumProvider, webmaxDappClient } from "webmax2/dapp";

const WALLET_URL = "#WALLET_URL#";

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
		providers: {
			eip155: ethereumProvider({
				httpRpcUrls: {
					1: "https://mainnet.infura.io/v3",
					5: "https://goerli.infura.io/v3",
					10: "https://mainnet.optimism.io",
					137: "https://rpc-mainnet.maticvigil.com/",
				},
			}),
		},
	});

	const provider = await client.provider("eip155");

	// @ts-ignore
	window.ethereum.request = (params) => {
		const result = provider.request(params);
		console.log("Request", params, result);
		return result;
	};

	// @ts-ignore
	window.ethereum.on = (event, cb) => {
		console.log("On", event);
		return provider.on(event, cb);
	};
};

main();
