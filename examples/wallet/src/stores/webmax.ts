import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ArrayUpdater, applyUpdater } from "./utils";

export type WalletConnection = { host: string; namespaces: string[] };

export type WebmaxConnectionState = {
	connections: WalletConnection[];
	setConnections: ArrayUpdater<WalletConnection>;
};

const initialState = {
	connections: [],
};

export const useWebmaxConnectionStore = create(
	persist<WebmaxConnectionState>(
		(set) => ({
			...initialState,
			setConnections: (cbOrConnections) =>
				set((state) => ({ connections: applyUpdater(cbOrConnections, state.connections) })),
		}),
		{ name: "webmax-connections" },
	),
);
