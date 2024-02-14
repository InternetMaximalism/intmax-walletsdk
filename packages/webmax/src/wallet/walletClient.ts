import { AbstractRequest, AbstractResponse } from "../types/messaging";
import { AbstractMessageSchema, ExtractSchema, WalletHandleTypes, WebmaxDefaultMessageSchema } from "../types/protocol";
import { parseChainedNamespace } from "../utils/parseChainedNamespace";
import { WebmaxWalletContext, createWebmaxWalletContext } from "./context";
import { onMessage, parentWindow, sendMessage } from "./messaging";

type PathedMethodSchema<TSchema extends AbstractMessageSchema = AbstractMessageSchema> = {
	[K in keyof TSchema]: {
		P0: `${TSchema[K]["namespace"]}/${TSchema[K]["method"]}`;
		schema: TSchema[K];
	};
}[number];

type WebmaxWalletClientHandler<TMethodSchema extends AbstractMessageSchema[number] = AbstractMessageSchema[number]> = (
	context: WebmaxWalletContext<TMethodSchema>,
) => AbstractResponse | Promise<AbstractResponse>;

export type WebmaxWalletClient<TSchema extends AbstractMessageSchema> = {
	ready: () => void;
	destruct: () => void;
	on: <
		TPath extends PathedMethodSchema<TSchema>["P0"],
		TMethodSchema extends Extract<PathedMethodSchema<TSchema>, { P0: TPath }>,
	>(
		path: TPath,
		cb: WebmaxWalletClientHandler<TMethodSchema["schema"]>,
	) => void;
};

export const webmaxWalletClient = <
	TSchema extends AbstractMessageSchema = WebmaxDefaultMessageSchema,
	_TSchema extends AbstractMessageSchema = ExtractSchema<TSchema, WalletHandleTypes>,
>(): WebmaxWalletClient<_TSchema> => {
	const handlers: [string, WebmaxWalletClientHandler][] = [];

	const dispatch = async (request: AbstractRequest, origin: string) => {
		const { namespace: nsLike, method } = request;
		const { ns } = parseChainedNamespace(nsLike);
		const context = createWebmaxWalletContext(request, origin);
		const handler = handlers.find(([path]) => path === `${ns}/${method}`) ?? handlers.find(([path]) => path === ns);
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
			dispatch(payload, "internal");
		},
		destruct: () => clean(),
	};
};
