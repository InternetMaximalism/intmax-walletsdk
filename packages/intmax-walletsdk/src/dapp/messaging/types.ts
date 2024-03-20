import { IntmaxReadyResult } from "src";
import type Component from "./iframe/Component.svelte";

export type WalletClientRef = {
	window?: Window;
	iframe?: { iframeRef: HTMLIFrameElement; component: Component };
	ref?: unknown;
	id?: number;
	calls?: Promise<unknown>[];
	handshake?: IntmaxReadyResult;
};
