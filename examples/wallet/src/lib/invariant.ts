// biome-ignore lint/suspicious/noExplicitAny: This is a type assertion function
export default function invariant(condition: any, msg?: string): asserts condition {
	if (condition) return;
	throw new Error(msg || "Invariant failed");
}
