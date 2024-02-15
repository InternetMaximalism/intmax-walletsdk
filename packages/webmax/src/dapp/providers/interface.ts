import { ChainedNamespace } from "src";
import { WebmaxStore } from "../store";

export type WebmaxProviderOptions<NS extends string> = {
	namespace: NS | ChainedNamespace<NS>;
	callWallet: <T>(args: { method: string; params?: unknown }) => Promise<T>;
	store: WebmaxStore;
};

//TODO: Redesign
export type WebmaxProvider<Provider, NS extends string = string> = (
	options: WebmaxProviderOptions<NS>,
) => Provider | Promise<Provider>;
