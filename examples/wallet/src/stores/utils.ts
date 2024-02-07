export type ArrayUpdater<T> = (cbOrItems: ((indexes: T[]) => T[]) | T[]) => void;

export const applyUpdater = <T>(cbOrItems: ((indexes: T[]) => T[]) | T[], items: T[]) => {
	return typeof cbOrItems === "function" ? cbOrItems(items) : cbOrItems;
};
