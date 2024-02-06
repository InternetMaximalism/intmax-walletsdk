import { ANKR_BALANCE_CHAIN_MAP, AnkrBalanceChain } from "@/constants";
import { BalanceWithPrice, Token } from "@/types";
import { Balance as AnkrBalance } from "@ankr.com/ankr.js";
import { Account, Address, Chain, erc20Abi } from "viem";
import { getAnkrProvider } from "../ankrProvider";
import { createViemClient } from "../viemClient";

const toBalanceWithPrice = (balance: AnkrBalance): BalanceWithPrice => {
	const pair = Object.entries(ANKR_BALANCE_CHAIN_MAP).find(([, ankrChain]) => ankrChain === balance.blockchain);
	const chainId = Number(pair?.[0]);
	const baseToken = {
		...{ decimals: balance.tokenDecimals, symbol: balance.tokenSymbol },
		...{ name: balance.tokenName, logoURI: balance.thumbnail },
	};
	const token: Token =
		balance.tokenType === "NATIVE"
			? { chainId, type: "native", ...baseToken }
			: { chainId, type: "erc20", address: balance.contractAddress as string, ...baseToken };
	return {
		token,
		balance: BigInt(balance.balance),
		priceUsd: Number(balance.tokenPrice),
	};
};

export const fetchAnkrBalanceWithPrice = async (params: { account: Account; chains: Chain[]; whitelist?: boolean }) => {
	const { account, chains, whitelist } = params;
	const ankr = getAnkrProvider();

	const ankrChains = chains
		.map((chain) => chain.id)
		.filter((chainId): chainId is AnkrBalanceChain => chainId in ANKR_BALANCE_CHAIN_MAP)
		.map((chainId) => ANKR_BALANCE_CHAIN_MAP[chainId]);

	const result = await ankr.getAccountBalance({
		walletAddress: account.address,
		blockchain: ankrChains,
		onlyWhitelisted: whitelist,
	});

	const balanceWithPrice = result.assets.map(toBalanceWithPrice);
	return balanceWithPrice;
};

export const fetchTokenBalance = async (params: { account: Account; token: Token; chain: Chain }) => {
	const { account, token, chain } = params;

	const client = createViemClient(chain);

	if (token.type === "native") {
		return { token, balance: await client.getBalance(account), priceUsd: 0 };
	}

	const balance = await client.readContract({
		abi: erc20Abi,
		functionName: "balanceOf",
		address: token.address as Address,
		args: [account.address],
	});
	return { token, balance, priceUsd: 0 };
};
