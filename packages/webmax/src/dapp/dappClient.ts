export type WebmaxDappClientOptions = {
	url: string;
	timeout?: number;
};

export type WebmaxDappClient = {
	connect: () => Promise<void>;
	provider: (namespace: string) => {
		request: (namespace: string) => void;
		on: (event: never, callback: (data: never) => void) => void;
	};
};
