export type BaseStorage = {
	get: <T>(key: string) => T | null | Promise<T | null>;
	set: (key: string, value: unknown) => void | Promise<void>;
	remove: (key: string) => void | Promise<void>;
};

export type IntmaxDappState = {
	supportedNamespaces: string[];
	supportedChains: string[];
	accounts: { eip155: string[] };
	currentChains: { eip155: string | null };
};

export type IntmaxStateStore = {
	getState: () => Promise<IntmaxDappState>;
	setState: (state: IntmaxDappState | ((state: IntmaxDappState) => IntmaxDappState)) => Promise<void>;
};

const initialState: IntmaxDappState = {
	supportedNamespaces: [],
	supportedChains: [],
	accounts: { eip155: [] },
	currentChains: { eip155: null },
};

//TODO: Redesign
export const createIntmaxDappStore = (storage: BaseStorage): IntmaxStateStore => {
	const getState = async () => {
		const state = await storage.get<IntmaxDappState>("intmax");
		return state ?? initialState;
	};

	const setState = async (state: IntmaxDappState | ((state: IntmaxDappState) => IntmaxDappState)) => {
		const currentState = await getState();
		const newState = typeof state === "function" ? state(currentState) : state;
		await storage.set("intmax", newState);
	};

	return {
		getState,
		setState,
	};
};

type EthereumProviderState = {
	supportedChains: number[];
	chainId: number | null;
	accounts: string[];
};

const toEthereumProviderState = (state: IntmaxDappState): EthereumProviderState => {
	const supportedChains = state.supportedChains
		.map((c) => c.split(":"))
		.filter((c) => c[0] === "eip155")
		.map((c) => Number(c[1]));

	return {
		supportedChains,
		chainId: state.currentChains.eip155 ? Number(state.currentChains.eip155) : null,
		accounts: state.accounts.eip155,
	};
};

export const _ethStoreWrapper = (store: IntmaxStateStore) => ({
	getState: async (): Promise<EthereumProviderState> => {
		const state = await store.getState();
		return toEthereumProviderState(state);
	},
	setState: async (state: EthereumProviderState | ((state: EthereumProviderState) => EthereumProviderState)) => {
		const currentState = await store.getState().then(toEthereumProviderState);
		const newState = typeof state === "function" ? state(currentState) : state;
		return store.setState((state) => ({
			...state,
			accounts: { ...state.accounts, eip155: newState.accounts },
			currentChains: {
				...state.currentChains,
				eip155: newState.chainId ? String(newState.chainId) : null,
			},
		}));
	},
});

export const memoryStorage = (): BaseStorage => {
	const storage: Map<string, unknown> = new Map();
	return {
		get: <T>(key: string) => (storage.get(key) ?? null) as T | null,
		set: (key: string, value: unknown) => {
			storage.set(key, value);
		},
		remove: (key: string) => {
			storage.delete(key);
		},
	};
};
