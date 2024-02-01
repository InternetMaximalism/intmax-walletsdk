import type { Namespace } from "./types";

export type WalletConfig = {
	supportedNamespaces: Namespace[];
};

export const createWalletClient = (config: WalletConfig) => {
	return {
		ready: () => {},
	};
};
