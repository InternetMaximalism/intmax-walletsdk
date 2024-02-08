import { PriceHistory, Token } from "@/types";
import { getAnkrProvider, toAnkrChain } from "../ankrProvider";

const DETAIL_NUM = 20;
const DAY_INTERNAL = (3600 * 24) / DETAIL_NUM;

export const fetchTokenPriceHistory = async (params: {
	token: Token;
	scale: "1d" | "7d" | "30d";
}): Promise<PriceHistory> => {
	const { token, scale } = params;
	const ankr = getAnkrProvider();

	const ankrChain = toAnkrChain(params.token.chainId);
	const interval = { "1d": DAY_INTERNAL, "7d": DAY_INTERNAL * 7, "30d": DAY_INTERNAL * 30 }[scale];

	if (!ankrChain) throw new Error("Invalid chain");

	let contractAddress: string;
	if (token.type === "erc20") contractAddress = token.address;
	else {
		const result = await ankr.getTokenPrice({ blockchain: ankrChain });
		if (!result.contractAddress) throw new Error("Invalid contract address");
		contractAddress = result.contractAddress;
	}

	try {
		const result = await ankr.getTokenPriceHistory({
			blockchain: ankrChain,
			contractAddress,
			interval,
			toTimestamp: Math.floor(Date.now() / 1000),
			limit: DETAIL_NUM + 1,
		});

		return {
			token,
			history: result.quotes.map((item) => ({ timestamp: item.timestamp, priceUsd: Number(item.usdPrice) })),
		};
	} catch (e) {
		if (e instanceof Error && e.message.includes("invalid params")) {
			return {
				token,
				history: Array.from({ length: DETAIL_NUM }, (_, i) => ({
					timestamp: Math.floor(Date.now() / 1000) - (DETAIL_NUM - i) * interval,
					priceUsd: 1,
				})),
			};
		}
		throw e;
	}
};

export const fetchTokenPrice = async (token: Token): Promise<number> => {
	const ankr = getAnkrProvider();
	const ankrChain = toAnkrChain(token.chainId);

	if (!ankrChain) throw new Error("Invalid chain");

	const result = await ankr.getTokenPrice({
		blockchain: ankrChain,
		contractAddress: token.type === "erc20" ? token.address : undefined,
	});

	return Number(result.usdPrice);
};
