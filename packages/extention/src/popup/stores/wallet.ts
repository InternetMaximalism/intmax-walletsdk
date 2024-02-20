import { WebmaxWallet } from "@/core/types";
import { createStorageStore } from "@/lib/zustand";
import { currentWebmaxWalletStorage, webmaxWalletsStorage } from "@/storage";

export const useWalletStore = createStorageStore(
	{
		current: currentWebmaxWalletStorage,
		wallets: webmaxWalletsStorage,
	},
	(set) => ({
		setCurrent: (wallet: WebmaxWallet | null) => set({ current: wallet }),
		setWallets: (wallets: WebmaxWallet[]) => set({ wallets }),
	}),
);
