import { convertRpcReqToInternalReq } from "@/lib/blockchain/transaction";
import { isConnected } from "@/lib/webmax";
import { withResolvers } from "@/lib/withResolvers";
import { useNetworksStore } from "@/stores/network";
import { useWebmaxConnectionStore } from "@/stores/webmax";
import { useLayoutEffect } from "react";
import { Address, Hash, Hex, LocalAccount, isAddressEqual } from "viem";
import { DappMetadata } from "webmax2";
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

		const findAccount = (address: Address) => {
			const account = localAccounts.find((account) => isAddressEqual(account.address, address));
			if (!account) throw new Error("Account Not found");
			return account;
		};

		const signMessage = async (address: Address, data: Hex, metadata: DappMetadata | undefined) => {
			const account = findAccount(address);
			const { promise, resolve, reject } = withResolvers<Hex>();

			open({ id: "sign-message", account, dappMetadata: metadata, data, onSign: resolve, onCancel: reject });

			return promise;
		};

		webmax.on("eip155/eth_sign", async (c) => {
			const [address, data] = c.req.params;
			try {
				const signature = await signMessage(address, data, c.req.metadata);
				return c.success(signature);
			} catch {
				return c.failure("", { code: 4001 });
			}
		});

		webmax.on("eip155/personal_sign", async (c) => {
			const [data, address] = c.req.params;
			try {
				const signature = await signMessage(address, data, c.req.metadata);
				return c.success(signature);
			} catch {
				return c.failure("", { code: 4001 });
			}
		});

		webmax.on("eip155/eth_sendTransaction", async (c) => {
			const [chainId, [rpcRequest]] = [c.req.chainId, c.req.params];
			if (!chainId) return c.failure("Invalid chainId", { code: 4001 });

			const account = findAccount(rpcRequest.from ?? ethereumAccounts[0]);
			const { promise, resolve, reject } = withResolvers<Hash>();

			try {
				const transaction = convertRpcReqToInternalReq({ request: rpcRequest, account, chainId });
				open({ id: "send-transaction", transaction, dappMetadata: c.req.metadata, onSign: resolve, onCancel: reject });

				const hash = await promise;
				return c.success(hash);
			} catch {
				return c.failure("", { code: 4001 });
			}
		});

		webmax.on("eip155/eth_signTransaction", async (c) => {
			const [chainId, [rpcRequest]] = [c.req.chainId, c.req.params];
			if (!chainId) return c.failure("Invalid chainId", { code: 4001 });

			const account = findAccount(rpcRequest.from ?? ethereumAccounts[0]);
			const { promise, resolve, reject } = withResolvers<Hash>();

			try {
				const transaction = convertRpcReqToInternalReq({ request: rpcRequest, account, chainId });
				open({ id: "sign-transaction", transaction, dappMetadata: c.req.metadata, onSign: resolve, onCancel: reject });

				const hash = await promise;
				return c.success(hash);
			} catch {
				return c.failure("", { code: 4001 });
			}
		});

		webmax.on("eip155/eth_signTypedData_v4", async (c) => {
			const [address, message_] = c.req.params;
			const data = typeof message_ === "string" ? JSON.parse(message_) : message_;

			const account = findAccount(address);
			const { promise, resolve, reject } = withResolvers<Hash>();

			try {
				open({
					...{ id: "sign-typed-data", account, data },
					dappMetadata: c.req.metadata,
					chainId: c.req.chainId ?? "1",
					...{ onSign: resolve, onCancel: reject },
				});
				const hash = await promise;
				return c.success(hash);
			} catch {
				return c.failure("", { code: 4001 });
			}
		});

		webmax.ready();

		return () => webmax.destruct();
	}, [chains, accounts, open, connections, setConnections]);
};
