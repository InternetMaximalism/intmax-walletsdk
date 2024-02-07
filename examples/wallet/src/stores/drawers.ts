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
};

export type DrawerState = {
	props: DrawerPropsPattern | null;
	setDrawerProps: (props: DrawerPropsPattern | null) => void;
};

const initialState = {
	props: null,
};

export const useDrawerStore = create<DrawerState>((set) => ({
	...initialState,
	setDrawerProps: (props) => set({ props }),
}));
