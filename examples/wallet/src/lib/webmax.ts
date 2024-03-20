import { WalletConnection } from "@/stores/webmax";

type SimpleContext = { req: { host: string }; namespace: string };

export const isConnected = (c: SimpleContext, connections: WalletConnection[]) => {
	return connections.some(
		(connection) => connection.host === c.req.host && connection.namespaces.includes(c.namespace),
	);
};
