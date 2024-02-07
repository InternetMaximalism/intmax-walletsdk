import { ENSAccount, ensAccountsBatch } from "@/lib/blockchain/ens";
import { useAccountStore } from "@/stores/account";
import { useQueries } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { Account, Address, english, generateMnemonic, mnemonicToAccount, privateKeyToAccount } from "viem/accounts";

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
	const accounts = useAccounts();
	const current = useAccountStore((state) => state.current);

	const _account = useMemo(() => {
		if (!current) return accounts[0] ?? null;
		const account = accounts.find((account) => account.address === current);

		return account;
	}, [accounts, accounts[0], current]);

	const ensAccounts = useENSAccounts(_account ? [_account] : []);

	return ensAccounts?.[0]?.data ?? _account ?? null;
};

export const useAccounts = () => {
	const mnemonic = useAccountStore((state) => state.mnemonic);
	const indexes = useAccountStore((state) => state.indexes);
	const privateKeys = useAccountStore((state) => state.privateKeys);
	const viewAddresses = useAccountStore((state) => state.viewAddresses);

	const _accounts = useMemo(() => {
		const mnemonicAccounts = mnemonic ? indexes.map((index) => getAccount(mnemonic, index)) : [];
		const privateAccounts = privateKeys.map(privateKeyToAccount);
		const viewAccounts = viewAddresses.map((address) => ({ address, type: "json-rpc" }) as const);
		return [...mnemonicAccounts, ...privateAccounts, ...viewAccounts];
	}, [mnemonic, indexes, privateKeys, viewAddresses]);

	const results = useENSAccounts(_accounts);
	const ensAccounts = results
		.map((result, i) => result.data ?? _accounts[i])
		.filter((account): account is ENSAccount => !!account);

	return ensAccounts;
};

export const useCreateAccount = () => {
	const mnemonic = useAccountStore((state) => state.mnemonic);
	const setMnemonic = useAccountStore((state) => state.setMnemonic);
	const setCurrent = useAccountStore((state) => state.setCurrent);
	const setIndexes = useAccountStore((state) => state.setIndexes);

	const create = useCallback(() => {
		if (mnemonic) throw new Error("MNEMONIC_ALREADY_EXISTS");
		const newMnemonic = generateMnemonic(english);
		setMnemonic(newMnemonic);
		setCurrent(getAccount(newMnemonic, 0).address);
		setIndexes([0]);
	}, [mnemonic, setMnemonic, setCurrent, setIndexes]);

	return create;
};

export const useSwitchAccount = () => {
	const setCurrent = useAccountStore((state) => state.setCurrent);

	const switchAccount = useCallback(
		(address: Address) => {
			setCurrent(address);
		},
		[setCurrent],
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
