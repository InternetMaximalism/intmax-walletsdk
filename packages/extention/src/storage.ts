import { Session, WebmaxWallet } from "@/core/types";
import { storage } from "wxt/storage";
import { DEFAULT_WALLETS } from "./constants";

export const webmaxWalletsStorage = storage.defineItem<WebmaxWallet[]>("sync:wallets", {
	defaultValue: DEFAULT_WALLETS,
});

export const currentWebmaxWalletStorage = storage.defineItem<WebmaxWallet | null>("local:currentWallet", {
	defaultValue: DEFAULT_WALLETS[0] ?? null,
});

export const sessionStorage = storage.defineItem<Record<string, Session>>("local:session", {
	defaultValue: {},
});
