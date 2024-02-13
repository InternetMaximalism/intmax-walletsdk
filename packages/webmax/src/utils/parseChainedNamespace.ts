import { ChainedNamespace } from "src";

export const parseChainedNamespace = <NS extends string>(namespace: ChainedNamespace<NS> | NS) => {
	const [ns, chainId] = namespace.split(":") as [NS, string | undefined];
	return { ns, chainId };
};
