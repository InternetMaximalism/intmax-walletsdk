import type { Namespace } from "./types/protocol";

export type WalletConfig = {
	supportedNamespaces: Namespace[];
};

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
export const createWalletClient = (config: WalletConfig) => {
	return {
		ready: () => {},
	};
};
