import { AbstractErrorResponse, AbstractRequest, AbstractSuccessResponse, WindowHandling } from "../types/messaging";
import { AbstractMessageSchema, ChainedNamespace } from "../types/protocol";

export type WebmaxWalletContext<MethodSchema extends AbstractMessageSchema[number]> = {
	namespace: ChainedNamespace<MethodSchema["namespace"]> | MethodSchema["namespace"];
	method: MethodSchema["method"];
	req: {
		params: MethodSchema["params"];
		origin: string;
		raw: AbstractRequest;
	};
	window: (handling: WindowHandling) => void;
	success: (result: MethodSchema["result"]) => AbstractSuccessResponse;
	failure: (message: string, opt?: { code?: number; window?: WindowHandling }) => AbstractErrorResponse;
};

export const createWebmaxWalletContext = <MethodSchema extends AbstractMessageSchema[number]>(
	request: AbstractRequest,
	origin: string,
) => {
	type Context = WebmaxWalletContext<MethodSchema>;
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
