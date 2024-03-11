import EventEmitter from "eventemitter3";
import { EIP1193LikeProvider, RpcProviderError } from "walletnext/dapp";
import { inpageMessaging } from "../messagings/inpage";

export const createInjectableProvider = (): EIP1193LikeProvider => {
	const emitter = new EventEmitter();

	inpageMessaging.onEvent("onEvent", ({ data }) => {
		console.info("provider Received event", data.event, data.data);
		emitter.emit(data.event, data.data);
	});

	const log = (method: string, ...args: unknown[]) => {
		if (method === "eth_chainId") return;
		if (method === "eth_call") return;
		if (method === "web3_clientVersion") return;
		if (method === "eth_blockNumber") return;
		console.info(...args);
	};

	const request = async (args: { method: string; params?: unknown }) => {
		const { method, params } = args;
		const id = Math.floor(Math.random() * 1000000).toString();
		log(method, "provider Sending request", method, id, params);
		const response = await inpageMessaging.sendMessage("request", { namespace: "eip155", method, params });
		log(method, "provider Received request", method, id, JSON.stringify(response).slice(0, 100));
		if (response.error) throw new RpcProviderError(response.error.message, response.error.code);
		return response.result;
	};

	return {
		isMetaMask: true,
		isWalletNext: true,
		request,
		on: (event, cb) => emitter.on(event, cb),
		removeListener: (event, cb) => emitter.removeListener(event, cb),
		providers: undefined,
	} as EIP1193LikeProvider;
};
