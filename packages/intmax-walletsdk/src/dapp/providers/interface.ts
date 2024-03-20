import { ChainedNamespace } from "src";
import { IntmaxStateStore } from "../store";

export type NamespaceProviderOptions<NS extends string> = {
	namespace: NS | ChainedNamespace<NS>;
	callWallet: <T>(args: { method: string; params?: unknown; chainId?: string }) => Promise<T>;
	store: IntmaxStateStore;
};

//TODO: Redesign
export type NamespaceProvider<Provider, NS extends string = string> = (
	options: NamespaceProviderOptions<NS>,
) => Provider;
