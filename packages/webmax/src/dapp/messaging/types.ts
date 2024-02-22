import { WebmaxReadyResult } from "src";

export type WalletClientRef = {
	window?: Window;
	iframe?: HTMLIFrameElement;
	id?: number;
	calls?: Promise<unknown>[];
	handshake?: WebmaxReadyResult;
};
