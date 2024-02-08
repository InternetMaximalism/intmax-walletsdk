import { Amount, AmountWithPrice, Balance, BalanceWithPrice } from "@/types";
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
type FormatterRule = { lt?: number; lte?: number; formatter: Formatter };

const TOKEN_SHORT: FormatterRule[] = [
	{ lte: 0, formatter: "0" },
	{ lt: 0.0001, formatter: "<0.0001" },
	{ lt: 0.01, formatter: DECIMALS(4) },
	{ lt: 1, formatter: DECIMALS(3) },
	{ lt: 1_000_000, formatter: DECIMALS(2) },
	{ lt: 1_000_000_000_000, formatter: COMPACT_DECIMALS(2) },
	{ lt: Infinity, formatter: "SO MUCH" },
];

const TOKEN_LONG: FormatterRule[] = [
	{ lte: 0, formatter: "0" },
	{ lt: 0.0001, formatter: "<0.0001" },
	{ lt: 100_000, formatter: DECIMALS(5, 2) },
	{ lt: 1_000_000_000_000, formatter: DECIMALS(2) },
	{ lt: Infinity, formatter: "HMM, A LOT" },
];

const USD_BALANCE: FormatterRule[] = [
	{ lte: 0, formatter: "$0.00" },
	{ lt: 0.001, formatter: "<$0.001" },
	{ lt: 1_00, formatter: DECIMALS_USD(3) },
	{ lt: 1_000_000, formatter: DECIMALS_USD(2) },
	{ lt: 1_000_000_000_000, formatter: DOCIMALS_USD_COMPACT(2) },
	{ lt: Infinity, formatter: "$ SO MUCH" },
];

const FORMATTERS = { TOKEN_SHORT, TOKEN_LONG, USD_BALANCE };

type FormatterType = keyof typeof FORMATTERS;

export const formatNumber = (value: number, type: FormatterType) => {
	const rules = FORMATTERS[type];
	const rule = rules.find((rule) => (rule.lt !== undefined ? value < rule.lt : value <= (rule?.lte ?? 0)));

	if (!rule) throw new Error("No formatter found");
	return typeof rule.formatter === "string" ? rule.formatter : rule.formatter.format(value);
};

export const formatAmount = (balance: Amount | null, type: FormatterType = "TOKEN_SHORT") => {
	if (!balance) return formatNumber(0, type);
	const value = formatUnits(balance.amount, balance.token.decimals);
	return formatNumber(Number(value), type);
};

export const formatBalance = (balance: Balance | null, type: FormatterType = "TOKEN_SHORT") => {
	if (!balance) return formatNumber(0, type);
	const value = formatUnits(balance.balance, balance.token.decimals);
	return formatNumber(Number(value), type);
};

export const formatUsdBalance = (balance: BalanceWithPrice | null, type: FormatterType = "USD_BALANCE") => {
	if (!balance) return formatNumber(0, type);
	const value = formatUnits(balance.balance, balance.token.decimals);
	return formatNumber(balance.priceUsd * Number(value), type);
};

export const formatUsdAmount = (balance: AmountWithPrice | null, type: FormatterType = "USD_BALANCE") => {
	if (!balance) return formatNumber(0, type);
	const value = formatUnits(balance.amount, balance.token.decimals);
	return formatNumber(balance.priceUsd * Number(value), type);
};
