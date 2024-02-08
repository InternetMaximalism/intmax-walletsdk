export const withResolvers = <T>() => {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let reject: (reason?: any) => void = () => {};
	let resolve: (value: T | PromiseLike<T>) => void = () => {};
	const promise = new Promise<T>((_resolve, _reject) => {
		reject = _reject;
		resolve = _resolve;
	});
	return { promise, reject, resolve };
};
