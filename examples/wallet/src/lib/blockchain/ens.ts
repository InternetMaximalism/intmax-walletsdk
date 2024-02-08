import { create, windowScheduler } from "@yornaath/batshit";
import { Account } from "viem";
import { mainnet } from "viem/chains";
import { createViemClient } from "../viemClient";

export type ENSAccount = {
	ens: string | null;
	avatar: string | null;
} & Account;

export const fetchEnsAccounts = async (accounts: Account[]): Promise<ENSAccount[]> => {
	const client = createViemClient(mainnet);
	const ensNames = await Promise.all(accounts.map(async (account) => client.getEnsName(account)));
	const ensAvatars = await Promise.all(ensNames.map(async (name) => name && client.getEnsAvatar({ name })));

	return accounts.map((account, index) => {
		return { ...account, ens: ensNames[index] ?? null, avatar: ensAvatars[index] ?? null } satisfies ENSAccount;
	});
};

export const ensAccountsBatch = create({
	fetcher: fetchEnsAccounts,
	resolver: (items, query) => items.find((item) => item.address === query.address),
	scheduler: windowScheduler(10),
});
