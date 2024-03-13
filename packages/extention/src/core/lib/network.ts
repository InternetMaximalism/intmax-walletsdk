import { Network } from "../types";

export const isEqNetwork = (a: Omit<Network, "logoUrl" | "httpRpcUrl">, b: Omit<Network, "logoUrl" | "httpRpcUrl">) =>
	String(a.chainId) === String(b.chainId) && a.namespace === b.namespace;
