import { withResolvers } from "@/lib/withResolvers";
import { useNetworksStore } from "@/stores/network";
import { useLayoutEffect } from "react";
import { Hex, LocalAccount } from "viem";
import { webmaxWalletClient } from "webmax2/wallet";
import { useAccounts } from "./account";
import { useDrawer } from "./drawer";

// Note: In an environment like NextJS, where SSRs can occur, a little ingenuity is required.

export const useWebmax = () => {
	const { open } = useDrawer();
	const chains = useNetworksStore((state) => state.networks);
	const accounts = useAccounts();

	useLayoutEffect(() => {
		const webmax = webmaxWalletClient();

		const supportedChains = chains.map((chain) => `eip155:${chain.id}` as const);
		const localAccounts = accounts.filter((account) => account.type === "local") as LocalAccount[];
		const ethereumAccounts = localAccounts.map((account) => account.address);

		if (!(localAccounts.length && supportedChains.length)) return;

		webmax.on("webmax/webmax_handshake", (c) => {
			return c.success({
				supportedNamespaces: ["eip155", "webmax"],
				supportedChains: supportedChains,
			});
		});

		webmax.on("webmax/webmax_connect", (c) => {
			return c.success({
				supportedNamespaces: ["eip155", "webmax"],
				supportedChains: supportedChains,
				accounts: { eip155: ethereumAccounts },
			});
		});

		webmax.on("eip155/eth_requestAccounts", (c) => {
			return c.success(ethereumAccounts);
		});

		webmax.on("eip155/eth_sign", async (c) => {
			const [address, data] = c.req.params;
			const { promise, resolve, reject } = withResolvers<Hex>();

			const account = localAccounts.find((account) => account.address === address);
			if (!account) return c.failure("Account Not found", { code: 4001 });

			open({ id: "sign-message", account, data, onSign: resolve, onCancel: reject });

			try {
				const signature = await promise;
				return c.success(signature);
			} catch {
				return c.failure("", { code: 4001 });
			}
		});

		webmax.ready();

		return () => webmax.destruct();
	}, [chains, accounts, open]);
};
