import { ChainedNamespace } from "./protocol";

export type ClientMode = "popup" | "iframe";
export type WindowHandling = "keep" | "close";

export type AbstractRequest<NS extends string = string, Params = unknown> = {
	id: number;
	namespace: NS | ChainedNamespace<NS>;
	method: string;
	params: Params;
	metadata?: unknown;
};

export type AbstractSuccessResponse<NS extends string = string, Result = unknown> = {
	id: number;
	namespace: NS | ChainedNamespace<NS>;
	method: string;
	windowHandling: WindowHandling;
	result: Result;
};

export type AbstractErrorResponse<NS extends string = string> = {
	id: number;
	namespace: NS | ChainedNamespace<NS>;
	method: string;
	windowHandling: WindowHandling;
	error: { code: number; message: string };
};

export type AbstractResponse<NS extends string = string, Result = unknown> =
	| AbstractSuccessResponse<NS, Result>
	| AbstractErrorResponse<NS>;
