import { ENSAccount, ensAccountsBatch } from "@/lib/blockchain/ens";
import { useAccountStore } from "@/stores/account";
import { useQueries } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { Account, english, generateMnemonic, mnemonicToAccount } from "viem/accounts";

export const useENSAccounts = (accounts: Account[]) => {
	const results = useQueries({
		queries: accounts.map((account) => ({
			queryKey: ["ens", account.address],
			queryFn: () => ensAccountsBatch.fetch(account),
		})),
	});
	return results;
};

const cache = new Map<string, Account>();
const getAccount = (mnemonic: string, index: number) => {
	const key = `${mnemonic}-${index}`;
	if (cache.has(key)) return cache.get(key) as Account;
	const account = mnemonicToAccount(mnemonic, { addressIndex: index });
	cache.set(key, account);
	return account;
};

export const useAccount = () => {
	const mnemonic = useAccountStore((state) => state.mnemonic);
	const current = useAccountStore((state) => state.current);

	const _account = useMemo(() => {
		if (!mnemonic || current === null) return null;
		return getAccount(mnemonic, current) as ENSAccount;
	}, [mnemonic, current]);

	const ensAccounts = useENSAccounts(_account ? [_account] : []);

	return ensAccounts?.[0]?.data ?? _account ?? null;
};

export const useAccounts = () => {
	const mnemonic = useAccountStore((state) => state.mnemonic);
	const indexes = useAccountStore((state) => state.indexes);

	const _accounts = useMemo(() => {
		if (!mnemonic) return [];
		return indexes.map((index) => getAccount(mnemonic, index));
	}, [mnemonic, indexes]);

	const results = useENSAccounts(_accounts);
	const ensAccounts = results
		.map((result, i) => result.data ?? _accounts[i])
		.filter((account): account is ENSAccount => !!account);

	return ensAccounts;
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
