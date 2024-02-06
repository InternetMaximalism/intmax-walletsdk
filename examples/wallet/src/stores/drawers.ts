import { Token } from "@/types";
import { create } from "zustand";

export type DrawerPropsPattern = { id: "token-detail"; token: Token } | { id: "profile" };
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
