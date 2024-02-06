import { Balance, BalanceWithPrice } from "@/types";
import { formatUnits } from "viem";

const DECIMALS = (n: number, m = n) =>
	new Intl.NumberFormat("en-US", {
		notation: "standard",
		maximumFractionDigits: n,
		minimumFractionDigits: m,
	});

const COMPACT_DECIMALS = (n: number, m = n) =>
	new Intl.NumberFormat("en-US", {
		notation: "compact",
		maximumFractionDigits: n,
		minimumFractionDigits: m,
	});

const DECIMALS_USD = (n: number, m = n) =>
	new Intl.NumberFormat("en-US", {
		notation: "standard",
		maximumFractionDigits: n,
		minimumFractionDigits: m,
		currency: "USD",
		style: "currency",
	});

const DOCIMALS_USD_COMPACT = (n: number, m = n) =>
	new Intl.NumberFormat("en-US", {
		notation: "compact",
		maximumFractionDigits: n,
		minimumFractionDigits: m,
		currency: "USD",
		style: "currency",
	});

type Formatter = Intl.NumberFormat | string;
type FormatterRule = { lt?: number; formatter: Formatter };

const TOKEN_SHORT: FormatterRule[] = [
	{ formatter: "0" },
	{ lt: 0.0001, formatter: "<0.0001" },
	{ lt: 0.01, formatter: DECIMALS(4) },
	{ lt: 1, formatter: DECIMALS(3) },
	{ lt: 1_000_000, formatter: DECIMALS(2) },
	{ lt: 1_000_000_000_000, formatter: COMPACT_DECIMALS(2) },
	{ lt: Infinity, formatter: "OMG" },
];

const TOKEN_LONG: FormatterRule[] = [
	{ formatter: "0" },
	{ lt: 0.0001, formatter: "<0.0001" },
	{ lt: 100_000, formatter: DECIMALS(5, 2) },
	{ lt: 1_000_000_000_000, formatter: DECIMALS(2) },
	{ lt: Infinity, formatter: "WOW" },
];

const USD_BALANCE: FormatterRule[] = [
	{ formatter: "$0.00" },
	{ lt: 0.01, formatter: "<$0.01" },
	{ lt: 1_000_000, formatter: DECIMALS_USD(2) },
	{ lt: 1_000_000_000_000, formatter: DOCIMALS_USD_COMPACT(2) },
	{ lt: Infinity, formatter: "$ SO MUCH" },
];

const FORMATTERS = { TOKEN_SHORT, TOKEN_LONG, USD_BALANCE };

type FormatterType = keyof typeof FORMATTERS;

export const formatNumber = (value: number, type: FormatterType) => {
	const rules = FORMATTERS[type];
	const rule = rules
		.sort((a, b) => (a.lt ?? Infinity) - (b.lt ?? Infinity))
		.find((rule) => value < (rule.lt ?? Infinity));
	if (!rule) throw new Error("No formatter found");
	return typeof rule.formatter === "string" ? rule.formatter : rule.formatter.format(value);
};

export const formatBalance = (balance: Balance, type: FormatterType = "TOKEN_SHORT") => {
	const value = formatUnits(balance.balance, balance.token.decimals);
	return formatNumber(Number(value), type);
};

export const formatUsdBalance = (balance: BalanceWithPrice, type: FormatterType = "USD_BALANCE") => {
	const value = formatUnits(balance.balance, balance.token.decimals);
	return formatNumber(balance.priceUsd * Number(value), type);
};
