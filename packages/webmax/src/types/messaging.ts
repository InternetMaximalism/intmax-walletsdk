import { ChainedNamespace, Namespace } from "./protocol";

export type ClientMode = "popup" | "iframe";
export type WindowHandling = "keep" | "close";

export type AbstractRequest<Params = unknown> = {
	id: number;
	namespace: Namespace | ChainedNamespace;
	method: string;
	params: Params;
	metadata?: unknown;
};

export type AbstractSuccessResponse<Result = unknown> = {
	id: number;
	namespace: Namespace | ChainedNamespace;
	method: string;
	windowHandling: WindowHandling;
	result: Result;
};

export type AbstractErrorResponse = {
	id: number;
	namespace: Namespace | ChainedNamespace;
	method: string;
	windowHandling: WindowHandling;
	error: { code: number; message: string };
};

export type AbstractResponse<Result = unknown> = AbstractSuccessResponse<Result> | AbstractErrorResponse;
