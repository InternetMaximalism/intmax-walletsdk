import { isConnected } from "@/lib/webmax";
import { withResolvers } from "@/lib/withResolvers";
import { useNetworksStore } from "@/stores/network";
import { useWebmaxConnectionStore } from "@/stores/webmax";
import { useLayoutEffect } from "react";
import { Hex, LocalAccount } from "viem";
import { webmaxWalletClient } from "webmax2/wallet";
import { useAccounts } from "./account";
import { useDrawer } from "./drawer";

// Note: In an environment like NextJS, where SSRs can occur, a little ingenuity is required.

export const useWebmax = () => {
	const { open } = useDrawer();
	const accounts = useAccounts();

	const chains = useNetworksStore((state) => state.networks);
	const { connections, setConnections } = useWebmaxConnectionStore();

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

		webmax.on("webmax/webmax_connect", async (c) => {
			const [origin, dappMetadata] = [c.req.origin, c.req.metadata];
			if (!dappMetadata) return c.failure("Invalid metadata", { code: 4001 });

			if (isConnected(c, connections)) {
				return c.success({
					supportedNamespaces: ["eip155", "webmax"],
					supportedChains: supportedChains,
					accounts: { eip155: ethereumAccounts },
				});
			}

			const { promise, resolve, reject } = withResolvers<void>();

			open({ id: "webmax-connect", origin, dappMetadata, onConnect: resolve, onCancel: reject });

			try {
				await promise;
				setConnections((connections) => [...connections, { origin, namespaces: ["eip155", "webmax"] }]);

				return c.success({
					supportedNamespaces: ["eip155", "webmax"],
					supportedChains: supportedChains,
					accounts: { eip155: ethereumAccounts },
				});
			} catch {
				return c.failure("User Rejected", { code: 4001 });
			}
		});

		webmax.on("eip155/eth_requestAccounts", async (c) => {
			const [origin, dappMetadata] = [c.req.origin, c.req.metadata];
			if (!dappMetadata) return c.failure("Invalid metadata", { code: 4001 });

			if (isConnected(c, connections)) return c.success(ethereumAccounts);

			const { promise, resolve, reject } = withResolvers<void>();

			open({ id: "webmax-connect", origin, dappMetadata, onConnect: resolve, onCancel: reject });

			try {
				await promise;
				setConnections((connections) => [...connections, { origin, namespaces: ["eip155", "webmax"] }]);

				return c.success(ethereumAccounts);
			} catch {
				return c.failure("User Rejected", { code: 4001 });
			}
		});

		webmax.on("eip155/eth_sign", async (c) => {
			const [address, data] = c.req.params;
			const { promise, resolve, reject } = withResolvers<Hex>();

			if (!isConnected(c, connections)) return c.failure("Not connected", { code: 4100 });

			const account = localAccounts.find((account) => account.address === address);
			if (!account) return c.failure("Account Not found", { code: 4001 });

			open({ id: "sign-message", account, dappMetadata: c.req.metadata, data, onSign: resolve, onCancel: reject });

			try {
				const signature = await promise;
				return c.success(signature);
			} catch {
				return c.failure("", { code: 4001 });
			}
		});

		webmax.ready();

		return () => webmax.destruct();
	}, [chains, accounts, open, connections, setConnections]);
};
