import { WalletMetadata, WebmaxWallet } from "@/core/types";
import { createStorageStore } from "@/lib/zustand";
import { currentWebmaxWalletStorage, walletMetadataStorage, webmaxWalletsStorage } from "@/storage";

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

export const useWalletMetadataStore = createStorageStore(
	{
		metadataList: walletMetadataStorage,
	},
	(set) => ({
		setMetadataList: (metadataList: WalletMetadata[]) => set({ metadataList }),
		setMetadata: (wallet: WebmaxWallet, metadata: WalletMetadata) =>
			set((state) => {
				const filtered = state.metadataList?.filter((m) => m.url !== wallet.url) ?? [];
				return { metadataList: [...filtered, metadata] };
			}),
		removeMetadata: (wallet: WebmaxWallet) =>
			set((state) => {
				const filtered = state.metadataList?.filter((m) => m.url !== wallet.url) ?? [];
				return { metadataList: filtered };
			}),
	}),
);
