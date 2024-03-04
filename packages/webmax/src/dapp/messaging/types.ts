import { WebmaxReadyResult } from "src";

export type WalletClientRef = {
	window?: Window;
	iframe?: HTMLIFrameElement;
	ref?: unknown;
	id?: number;
	calls?: Promise<unknown>[];
	handshake?: WebmaxReadyResult;
};
