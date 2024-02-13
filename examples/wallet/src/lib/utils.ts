import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const lightKey = <T>(items: T[], key: keyof T | ((item: T) => string)) => {
	if (typeof key === "function") return items.map(key);
	return items.map((item) => item[key]);
};

export const groupBy = <T, K extends string | number | symbol>(items: T[], key: (item: T) => K) => {
	const groups = {} as Record<K, T[]>;
	for (let i = 0; i < items.length; i++) {
		const group = key(items[i]);
		if (!groups[group]) groups[group] = [items[i]];
		else groups[group].push(items[i]);
	}
	return groups;
};

export const uniq = <T>(items: T[], key: keyof T | ((item: T) => string)) => {
	const results = new Map<unknown, T>();
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const value = typeof key === "function" ? key(item) : item[key];
		if (!results.has(value)) results.set(value, item);
	}

	return Array.from(results.values());
};

export const invert = <T extends Record<string | number, string | number>>(obj: T): { [K in keyof T as T[K]]: K } => {
	const result: Record<string | number, string | number> = {};
	for (const [key, value] of Object.entries(obj)) result[value] = key;
	return result as { [K in keyof T as T[K]]: K };
};
