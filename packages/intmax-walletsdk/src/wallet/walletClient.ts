import { AbstractRequest, AbstractResponse } from "../types/messaging";
import { AbstractMessageSchema, DefaultMessageSchema, ExtractSchema, WalletHandleTypes } from "../types/protocol";
import { parseChainedNamespace } from "../utils/parseChainedNamespace";
import { composeWalletHost } from "../utils/walletHost";
import { WalletSDKContext, createWalletSDKContext } from "./context";
import { onMessage, parentWindow, sendMessage } from "./messaging";

type PathedMethodSchema<TSchema extends AbstractMessageSchema = AbstractMessageSchema> = {
	[K in keyof TSchema]: {
		P0: `${TSchema[K]["namespace"]}/${TSchema[K]["method"]}`;
		schema: TSchema[K];
	};
}[number];

type WalletClientHandler<TMethodSchema extends AbstractMessageSchema[number] = AbstractMessageSchema[number]> = (
	context: WalletSDKContext<TMethodSchema>,
) => AbstractResponse | Promise<AbstractResponse>;

export type IntmaxWalletClient<TSchema extends AbstractMessageSchema> = {
	ready: () => void;
	destruct: () => void;
	on: <
		TPath extends PathedMethodSchema<TSchema>["P0"],
		TMethodSchema extends Extract<PathedMethodSchema<TSchema>, { P0: TPath }>,
	>(
		path: TPath,
		cb: WalletClientHandler<TMethodSchema["schema"]>,
	) => void;
};

export const intmaxWalletClient = <
	TSchema extends AbstractMessageSchema = DefaultMessageSchema,
	_TSchema extends AbstractMessageSchema = ExtractSchema<TSchema, WalletHandleTypes>,
>(): IntmaxWalletClient<_TSchema> => {
	const handlers: [string, WalletClientHandler][] = [];

	const dispatch = async (request: AbstractRequest, origin: string) => {
		const { namespace: nsLike, method } = request;
		const { ns } = parseChainedNamespace(nsLike);
		const context = createWalletSDKContext(request, composeWalletHost(request, origin));
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
			const payload: AbstractRequest = { id: 0, namespace: "intmax", method: "intmax_ready", params: undefined };
			dispatch(payload, "*");
		},
		destruct: () => clean(),
	};
};
