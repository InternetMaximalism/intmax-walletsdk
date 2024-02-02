import { AbstractErrorResponse, AbstractRequest, AbstractSuccessResponse, WindowHandling } from "./types/messaging";
import { ChainedNamespace, MessageMethod, MessageParams, MessageResult, Namespace } from "./types/protocol";

export type WebmaxWalletContext<NS extends Namespace, Method extends string> = {
	namespace: ChainedNamespace<NS> | NS;
	method: Method;
	params: MessageParams<NS, Method>;
	raw: { request: AbstractRequest; event: MessageEvent };
	window: (handling: WindowHandling) => void;
	success: (result: MessageResult<NS, Method>) => AbstractSuccessResponse;
	failure: (message: string, opt?: { code?: number; window?: WindowHandling }) => AbstractErrorResponse;
};

export const createWebmaxWalletContext = <NS extends Namespace, Method extends MessageMethod<NS>>(
	event: MessageEvent,
) => {
	type Context = WebmaxWalletContext<NS, Method>;
	const request = event.data as AbstractRequest;
	let windowHandling: WindowHandling = "close";

	const context: Context = {
		namespace: request.namespace as Context["namespace"],
		method: request.method as Context["method"],
		params: request.params as Context["params"],
		raw: { request, event },
		window: (handling) => {
			windowHandling = handling;
		},
		success: (result) => ({
			id: request.id,
			namespace: request.namespace,
			windowHandling,
			result,
		}),
		failure: (message, opt) => ({
			id: request.id,
			namespace: request.namespace,
			windowHandling: opt?.window || windowHandling,
			error: { message, code: opt?.code || 0 },
		}),
	};

	return context;
};
