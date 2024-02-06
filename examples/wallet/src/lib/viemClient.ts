import { getAnkrRpcUrl } from "@/constants";
import { http, Chain, HttpTransport, createPublicClient } from "viem";

const clientCache = new WeakMap<Chain, ReturnType<typeof createPublicClient>>();

export const createViemClient = <T extends Chain>(chain: T) => {
	if (clientCache.has(chain)) {
		return clientCache.get(chain) as ReturnType<typeof createPublicClient<HttpTransport, T>>;
	}

	const rpc = getAnkrRpcUrl(chain);
	const client = createPublicClient<HttpTransport, T>({
		chain,
		transport: http(rpc.url),
		batch: { multicall: chain.contracts && "multicall3" in chain.contracts },
	});
	clientCache.set(chain, client);

	return client;
};
