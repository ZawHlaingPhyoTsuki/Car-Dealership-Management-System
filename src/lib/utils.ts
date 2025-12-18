import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Generates avatar fallback initials from a name
 * @param name - Full name of the user
 * @returns First two letters in uppercase
 * @example getAvatarFallbackName("John Doe") → "JD"
 */
export function getAvatarFallbackName(name: string): string {
	if (name.length === 0) return "??";
	if (name.length === 1) return name.toUpperCase();
	return name.charAt(0).toUpperCase() + name.charAt(1).toUpperCase();
}

/**
 * Formats amount in Myanmar Kyat (Ks) currency
 * @param amount - Amount in whole Kyat (integer)
 * @returns Formatted string with "Ks" prefix and thousand separators
 * @example formatKs(1000000) → "Ks 1,000,000"
 */
export const formatKs = (amount: number): string => {
	return `Ks ${amount.toLocaleString("en-US")}`;
};

/**
 * Formats large amounts in Lakhs/Crores (Indian numbering system used in Myanmar)
 * @param amount - Amount in whole Kyat (integer)
 * @returns Formatted string in appropriate scale (crore, lakh, or basic Kyat)
 * @example
 * - formatInLakhsCrores(10000000) → "Ks 1.00 crore"
 * - formatInLakhsCrores(100000) → "Ks 1.00 lakh"
 * - formatInLakhsCrores(50000) → "Ks 50,000"
 */
export const formatInLakhsCrores = (amount: number): string => {
	if (amount >= 10000000) {
		// 1 crore = 10 million (10,000,000) Kyat
		const crores = amount / 10000000;
		return `Ks ${crores.toFixed(2)} crore`;
	} else if (amount >= 100000) {
		// 1 lakh = 100,000 Kyat
		const lakhs = amount / 100000;
		return `Ks ${lakhs.toFixed(2)} lakh`;
	} else {
		return formatKs(amount);
	}
};

/**
 * Calculates company profit and percentage based on shareholder percentage
 * Note: All amounts are in whole Kyat (integer)
 *
 * @param price - Total price of the car in Kyat
 * @param shareholderPercentage - Shareholder's percentage (0-100)
 * @returns Object containing company profit and percentage
 * @example
 * companyProfitAndPercentageCalculator(1000000, 30)
 * → { companyProfit: 700000, companyPercentage: 70 }
 */
export const companyProfitAndPercentageCalculator = (
	price: number,
	shareholderPercentage: number,
) => {
	const companyPercentage = 100 - shareholderPercentage;
	// Calculate profit as integer, rounding to nearest Kyat
	const companyProfit = Math.round((price * companyPercentage) / 100);
	return { companyProfit, companyPercentage };
};

/**
 * Calculates shareholder profit and percentage
 * Note: All amounts are in whole Kyat (integer)
 *
 * @param price - Total price of the car in Kyat
 * @param shareholderPercentage - Shareholder's percentage (0-100)
 * @returns Object containing shareholder profit and percentage
 * @example
 * shareholderProfitAndPercentageCalculator(1000000, 30)
 * → { shareholderProfit: 300000, shareholderPercentage: 30 }
 */
export const shareholderProfitAndPercentageCalculator = (
	price: number,
	shareholderPercentage: number,
) => {
	// Calculate profit as integer, rounding to nearest Kyat
	const shareholderProfit = Math.round((price * shareholderPercentage) / 100);
	return { shareholderProfit, shareholderPercentage };
};

/**
 * Rounds a number to 6 decimal places for calculation precision
 * Used to avoid floating-point arithmetic errors in profit calculations
 *
 * @param value - Number to round
 * @returns Number rounded to 6 decimal places
 * @example roundToSixDecimals(0.155555 + 0.255555) → 0.411111 (instead of 0.4111111111111111)
 */
export const roundToSixDecimals = (value: number): number => {
	return Math.round(value * 1000000) / 1000000;
};

/**
 * Formats a percentage value with up to 6 decimal places
 * Removes trailing zeros for cleaner display
 *
 * @param value - Percentage value
 * @returns Formatted string without unnecessary trailing zeros
 * @example
 * - formatPercentage(30) → "30"
 * - formatPercentage(33.333333) → "33.333333"
 * - formatPercentage(25.5) → "25.5"
 */
export const formatPercentage = (value: number): string => {
	return value.toFixed(6).replace(/\.?0+$/, "");
};

/**
 * Parses percentage input string, ensuring valid range (0-100)
 *
 * @param value - Input string from percentage field
 * @returns Parsed number between 0-100, or 0 if invalid
 * @example
 * - parsePercentageInput("30") → 30
 * - parsePercentageInput("150") → 100
 * - parsePercentageInput("abc") → 0
 */
export const parsePercentageInput = (value: string): number => {
	const parsed = parseFloat(value);
	if (Number.isNaN(parsed)) return 0;
	return Math.min(Math.max(parsed, 0), 100);
};

/**
 * Parses amount input string, ensuring valid range and precision
 *
 * @param value - Input string from amount field
 * @param max - Optional maximum allowed value
 * @returns Parsed number rounded to 6 decimal places, or 0 if invalid
 * @example
 * - parseAmountInput("1000000") → 1000000
 * - parseAmountInput("1000000.5") → 1000000.5
 * - parseAmountInput("abc") → 0
 */
export const parseAmountInput = (value: string, max?: number): number => {
	const parsed = parseFloat(value);
	if (Number.isNaN(parsed) || parsed < 0) return 0;

	if (max !== undefined && parsed > max) {
		return max;
	}

	return roundToSixDecimals(parsed);
};

/**
 * Calculates percentage from amount relative to total price
 *
 * @param amount - Partial amount
 * @param price - Total price
 * @returns Percentage value (0-100) rounded to 6 decimal places
 * @example calculatePercentageFromAmount(300000, 1000000) → 30
 */
export const calculatePercentageFromAmount = (
	amount: number,
	price: number,
): number => {
	if (price === 0) return 0;
	const percentage = (amount / price) * 100;
	return roundToSixDecimals(percentage);
};

export const salaryFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
});

export const expenseFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
});

export const profitFormatter = new Intl.NumberFormat("en-IN", {
	minimumFractionDigits: 0,
	maximumFractionDigits: 2,
});

export const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export const getMonthName = (month: number): string => {
	if (month < 0 || month > 11) {
		return "Invalid Month";
	}

	const currentMonth = new Date().getMonth();
	if (month === currentMonth) {
		return "This Month";
	}
	return months[month];
};

export const getYearName = (year: number): string => {
	const currentYear = new Date().getFullYear();

	if (year === currentYear) {
		return "This Year";
	}
	if (year === currentYear - 1) {
		return "Last Year";
	}

	return `In ${year}`;
};

export const formatAmountInLakhs = (amount: number): string => {
	const lakhs = amount / 100000;
	return new Intl.NumberFormat("en-IN", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(lakhs);
};
