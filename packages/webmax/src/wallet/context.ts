import { AbstractErrorResponse, AbstractRequest, AbstractSuccessResponse, WindowHandling } from "../types/messaging";
import { AbstractMessageSchema, DappMetadata } from "../types/protocol";
import { parseChainedNamespace } from "../utils/parseChainedNamespace";

export type WebmaxWalletContext<MethodSchema extends AbstractMessageSchema[number] = AbstractMessageSchema[number]> = {
	namespace: MethodSchema["namespace"];
	method: MethodSchema["method"];
	req: {
		chainId?: string;
		params: MethodSchema["params"];
		metadata?: DappMetadata;
		origin: string | "internal";
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

	const { ns, chainId } = parseChainedNamespace(request.namespace);

	const context: Context = {
		namespace: ns as Context["namespace"],
		method: request.method as Context["method"],
		req: {
			chainId,
			origin,
			metadata: request.metadata as Context["req"]["metadata"],
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
