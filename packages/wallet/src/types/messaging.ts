import { Namespace } from "./protocol";

export type ClientMode = "popup" | "iframe";

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
