import { AbstractRequest, AbstractResponse } from "../types/messaging";
import { AbstractMessageSchema, MessageMethod, Namespace, WalletClientMessageSchema } from "../types/protocol";
import { WebmaxWalletContext, createWebmaxWalletContext } from "./context";
import { onMessage, parentWindow, sendMessage } from "./messaging";

// biome-ignore lint/suspicious/noExplicitAny:
type WebmaxWalletClientHandler<NS extends Namespace = any, Method extends string = any> = (
	context: WebmaxWalletContext<NS, Method>,
) => AbstractResponse | Promise<AbstractResponse>;

export type WebmaxWalletClient<Schema extends AbstractMessageSchema[]> = {
	on: <NS extends Namespace, Method extends MessageMethod<Schema, NS> = MessageMethod<Schema, NS>>(
		path: NS | `${NS}/${Method}`,
		cb: WebmaxWalletClientHandler<NS, Method>,
	) => void;
	ready: () => void;
	destruct: () => void;
};

export const webmaxWalletClient = <
	Schemas extends AbstractMessageSchema[] = WalletClientMessageSchema,
>(): WebmaxWalletClient<Schemas> => {
	const handlers: [string, WebmaxWalletClientHandler][] = [];

	const dispatch = async (request: AbstractRequest, origin: string) => {
		const { namespace, method } = request;
		const context = createWebmaxWalletContext(request, origin);
		const handler =
			handlers.find(([path]) => path === `${namespace}/${method}`) ?? handlers.find(([path]) => path === namespace);
		if (handler) return sendMessage(await handler[1](context));
		return sendMessage(context.failure("method_not_supported"));
	};

	const clean = onMessage(dispatch);

	return {
		on: (path, cb) => handlers.push([path, cb]),
		ready: () => {
			const parent = parentWindow();
			if (!parent) return;
			const payload: AbstractRequest = { id: 0, namespace: "webmax", method: "webmax_handshake", params: undefined };
			dispatch(payload, parent.origin);
		},
		destruct: () => clean(),
	};
};
