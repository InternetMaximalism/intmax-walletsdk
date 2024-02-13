import { WalletConnection } from "@/stores/webmax";

type SimpleContext = { req: { origin: string }; namespace: string };

export const isConnected = (c: SimpleContext, connections: WalletConnection[]) => {
	return connections.some(
		(connection) => connection.origin === c.req.origin && connection.namespaces.includes(c.namespace),
	);
};
