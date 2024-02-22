import { WxtStorageItem } from "wxt/storage";
import { create } from "zustand";

type StoragesState<Storages extends { [key: string]: WxtStorageItem<unknown, Record<string, unknown>> }> = {
	// biome-ignore lint/suspicious/noExplicitAny: any
	[K in keyof Storages]: Storages[K] extends WxtStorageItem<infer S, any> ? S | null : never;
};

type Setter<T> = (state: T | ((state: T) => T)) => void;

export const createStorageStore = <
	Storages extends { [key: string]: WxtStorageItem<unknown, Record<string, unknown>> },
	Actions,
>(
	storages: Storages,
	actions: (setter: Setter<Partial<StoragesState<Storages>>>) => Actions,
) => {
	type State = StoragesState<Storages>;
	const initialState = Object.fromEntries(Object.keys(storages).map((key) => [key, null])) as State;
	const store = create<State & Actions>((set) => ({
		...initialState,
		...actions(set as Setter<Partial<State>>),
	}));

	const updateState = (key: keyof Storages, state: State[keyof Storages]) =>
		store.setState((c) => ({ ...c, [key]: state }));

	for (const [key, storage] of Object.entries(storages)) {
		storage.watch((state) => {
			if (state === null) return;
			updateState(key, state as State[keyof Storages]);
		});
		storage.getValue().then((state) => updateState(key, state as State[keyof Storages]));
		store.subscribe((state) => storage.setValue(state[key]));
	}

	return store;
};
