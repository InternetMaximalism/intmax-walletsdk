// biome-ignore lint/suspicious/noExplicitAny: This is a type assertion function
export default function invariant(condition: any): asserts condition {
	if (condition) return;
	throw new Error("Invariant failed");
}
