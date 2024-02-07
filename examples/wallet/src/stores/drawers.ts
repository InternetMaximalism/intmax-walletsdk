import { ENSAccount } from "@/lib/blockchain/ens";
import { Token } from "@/types";
import { Account } from "viem";
import { create } from "zustand";

export type DrawerPropsPattern =
	| { id: "token-detail"; account: Account; token: Token }
	| { id: "profile"; account: ENSAccount }
	| { id: "onboarding" };

export type DrawerProps<T extends DrawerPropsPattern["id"]> = Omit<Extract<DrawerPropsPattern, { id: T }>, "id"> & {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	setLock: (lock: boolean) => void;
};

export type DrawerState = {
	lock: boolean;
	props: DrawerPropsPattern | null;
	setDrawerProps: (props: DrawerPropsPattern | null, lock?: boolean) => void;
	setLock: (lock: boolean) => void;
};

const initialState = {
	props: null,
	lock: false,
};

export const useDrawerStore = create<DrawerState>((set) => ({
	...initialState,
	setDrawerProps: (props, lock) => set({ props, lock: lock ?? false }),
	setLock: (lock) => set((stat) => ({ ...stat, lock })),
}));
