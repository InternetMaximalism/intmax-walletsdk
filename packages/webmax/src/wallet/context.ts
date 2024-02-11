import { AbstractErrorResponse, AbstractRequest, AbstractSuccessResponse, WindowHandling } from "../types/messaging";
import {
	ChainedNamespace,
	MessageMethod,
	MessageParams,
	MessageResult,
	Namespace,
	WebmaxDefaultMessageSchema,
} from "../types/protocol";

export type WebmaxWalletContext<NS extends Namespace, Method extends string> = {
	namespace: ChainedNamespace<NS> | NS;
	method: Method;
	req: {
		params: MessageParams<WebmaxDefaultMessageSchema, NS, Method>;
		origin: string;
		raw: AbstractRequest;
	};
	window: (handling: WindowHandling) => void;
	success: (result: MessageResult<WebmaxDefaultMessageSchema, NS, Method>) => AbstractSuccessResponse;
	failure: (message: string, opt?: { code?: number; window?: WindowHandling }) => AbstractErrorResponse;
};

export const createWebmaxWalletContext = <
	NS extends Namespace,
	Method extends MessageMethod<WebmaxDefaultMessageSchema, NS>,
>(
	request: AbstractRequest,
	origin: string,
) => {
	type Context = WebmaxWalletContext<NS, Method>;
	let windowHandling: WindowHandling = "close";

	const context: Context = {
		namespace: request.namespace as Context["namespace"],
		method: request.method as Context["method"],
		req: {
			origin,
			params: request.params as Context["req"]["params"],
			raw: request,
		},
		window: (handling) => {
			windowHandling = handling;
		},
		success: (result) => ({
			id: request.id,
			namespace: request.namespace,
			method: request.method,
			windowHandling,
			result,
		}),
		failure: (message, opt) => ({
			id: request.id,
			namespace: request.namespace,
			method: request.method,
			windowHandling: opt?.window || windowHandling,
			error: { message, code: opt?.code || 0 },
		}),
	};

	return context;
};
