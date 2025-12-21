import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Checks if an amount is in lakhs (100,000 Kyat)
 *
 * @param amount - Amount to check
 * @returns Boolean indicating if amount is in lakhs
 * @example
 * - isLakhs(100000) → true
 * - isLakhs(50000) → false
 */
export const isLakhs = (amount: number): boolean => {
	return amount >= 100000;
};

// V2

/*
 * Formats a number with thousand separators and returns a safe string.
 * If the input is not a number, returns the fallback value.
 *
 * @param value - The number to format (optional, defaults to undefined)
 * @param fallback - The value to return if the input is not a number (optional, defaults to "-")
 * @returns A formatted string with thousand separators or the fallback value
 * @example
 * - formatNumberSafe(1234567) → "1,234,567"
 * - formatNumberSafe(undefined) → "-"
 * - formatNumberSafe(null) → "-"
 * - formatNumberSafe("abc") → "-"
 */
export function formatNumberSafe(
	value?: number | null,
	fallback = "-",
): string {
	if (typeof value !== "number") return fallback;
	return new Intl.NumberFormat("en-US").format(value);
}

/**
 * Normalizes a number input string by removing non-digits and leading zeros.
 *
 * @param value - The input string to normalize
 * @returns The normalized number or undefined if the input is empty
 * @example
 * - normalizeNumberInput("123abc") → 123
 * - normalizeNumberInput("00123") → 123
 * - normalizeNumberInput("") → undefined
 */
export function normalizeNumberInput(value: string): number | undefined {
	if (value === "") return undefined;

	// Remove all non-digits
	const digits = value.replace(/\D/g, "");

	// Remove leading zeros but keep single "0"
	const cleaned = digits.replace(/^0+(?=\d)/, "");

	// Convert to number
	const num = cleaned === "" ? 0 : parseInt(cleaned, 10);
	return Number.isNaN(num) ? undefined : num;
}
