import { describe, expect, it } from "vitest";
import { formatNumberSafe, isLakhs, normalizeNumberInput } from "./utils";

describe("lib/utils", () => {
	describe("isLakhs", () => {
		it("should return true for amounts >= 100,000", () => {
			expect(isLakhs(100000)).toBe(true);
			expect(isLakhs(150000)).toBe(true);
		});

		it("should return false for amounts < 100,000", () => {
			expect(isLakhs(50000)).toBe(false);
			expect(isLakhs(99999)).toBe(false);
		});
	});

	describe("formatNumberSafe", () => {
		it("should format numbers with commas", () => {
			expect(formatNumberSafe(100)).toBe("100");
			expect(formatNumberSafe(1000)).toBe("1,000");
			expect(formatNumberSafe(1000000)).toBe("1,000,000");
		});

		it("should return fallback for non-number values", () => {
			expect(formatNumberSafe(null)).toBe("-");
			expect(formatNumberSafe(undefined)).toBe("-");
		});

		it("should use custom fallback when provided", () => {
			expect(formatNumberSafe(null, "N/A")).toBe("N/A");
		});
	});

	describe("normalizeNumberInput", () => {
		it("should normalize number inputs", () => {
			expect(normalizeNumberInput("123abc")).toBe(123);
			expect(normalizeNumberInput("00123")).toBe(123);
			expect(normalizeNumberInput("")).toBe(undefined);
		});

		it("should return 0 for strings with only non-digits", () => {
			expect(normalizeNumberInput("abc")).toBe(0);
		});

		it("should handle single zero", () => {
			expect(normalizeNumberInput("0")).toBe(0);
		});
	});
});
