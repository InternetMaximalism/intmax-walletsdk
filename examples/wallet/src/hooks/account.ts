import { useAccountStore } from "@/stores/account";
import { useCallback, useMemo } from "react";
import { Account, english, generateMnemonic, mnemonicToAccount } from "viem/accounts";

const cache = new Map<string, Account>();
const getAccount = (mnemonic: string, index: number) => {
	const key = `${mnemonic}-${index}`;
	if (cache.has(key)) return cache.get(key);
	const account = mnemonicToAccount(mnemonic, { addressIndex: index });
	cache.set(key, account);
	return account;
};

export const useAccount = () => {
	const mnemonic = useAccountStore((state) => state.mnemonic);
	const current = useAccountStore((state) => state.current);

	const account = useMemo(() => {
		if (!mnemonic || current === null) return null;
		return getAccount(mnemonic, current);
	}, [mnemonic, current]);

	return account ?? null;
};

export const useAccounts = () => {
	const mnemonic = useAccountStore((state) => state.mnemonic);
	const indexes = useAccountStore((state) => state.indexes);

	const accounts = useMemo(() => {
		if (!mnemonic) return [];
		return indexes.map((index) => getAccount(mnemonic, index));
	}, [mnemonic, indexes]);

	return accounts;
};

export const useGenerateAccount = () => {
	const mnemonic = useAccountStore((state) => state.mnemonic);
	const setMnemonic = useAccountStore((state) => state.setMnemonic);
	const setCurrent = useAccountStore((state) => state.setCurrent);
	const setIndexes = useAccountStore((state) => state.setIndexes);

	const generate = useCallback(() => {
		if (mnemonic) throw new Error("MNEMONIC_ALREADY_EXISTS");
		const newMnemonic = generateMnemonic(english);
		setMnemonic(newMnemonic);
		setCurrent(0);
		setIndexes([0]);
	}, [mnemonic, setMnemonic, setCurrent, setIndexes]);

	return generate;
};

export const useSwitchAccount = () => {
	const indexes = useAccountStore((state) => state.indexes);
	const setCurrent = useAccountStore((state) => state.setCurrent);

	const switchAccount = useCallback(
		(index: number) => {
			if (!indexes.includes(index)) throw new Error("INDEX_NOT_FOUND");
			setCurrent(index);
		},
		[indexes, setCurrent],
	);

	return switchAccount;
};

export const useAddAccount = () => {
	const setIndexes = useAccountStore((state) => state.setIndexes);

	const addAccount = useCallback(() => {
		setIndexes((indexes) => {
			const nextIndex = Math.max(...indexes) + 1;
			return [...indexes, nextIndex];
		});
	}, [setIndexes]);

	return addAccount;
};
