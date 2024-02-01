export type Namespace = "webmax" | "eip155";

export type AbstractRequest = {
	id: number;
	namespace: Namespace;
	method: string;
	params: unknown[];
};

export type AbstractResponse = {
	id: number;
	namespace: Namespace;
	handling: "keep" | "close";
	result?: unknown;
	error?: string;
};

export type EIP155MessageSchema = [
	{
		method: "eth_signTypedData_v4";
	},
];
