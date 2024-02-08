import { getAnkrRpcUrl } from "@/constants";
import { http, Account, Chain, HttpTransport, createPublicClient, createWalletClient } from "viem";

const clientCache = new WeakMap<Chain, ReturnType<typeof createPublicClient>>();

export const createViemClient = <T extends Chain>(chain: T) => {
	if (clientCache.has(chain)) {
		return clientCache.get(chain) as ReturnType<typeof createPublicClient<HttpTransport, T>>;
	}

	const client = createPublicClient<HttpTransport, T>({
		chain,
		transport: http(),
		batch: {
			multicall: chain.contracts && "multicall3" in chain.contracts && { wait: 10 },
		},
	});
	clientCache.set(chain, client);

	return client;
};

export const createViemWalletClient = <T extends Chain>(chain: T, account: Account) => {
	const client = createWalletClient({
		chain,
		account,
		transport: http(getAnkrRpcUrl(chain).url),
	});

	return client;
};
