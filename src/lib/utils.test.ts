import { describe, expect, it } from "vitest";
import {
	calculatePercentageFromAmount,
	companyProfitAndPercentageCalculator,
	formatInLakhsCrores,
	formatKs,
	formatPercentage,
	getAvatarFallbackName,
	isLakhs,
	parseAmountInput,
	parsePercentageInput,
	roundToSixDecimals,
	shareholderProfitAndPercentageCalculator,
} from "./utils";

describe("lib/utils", () => {
	describe("getAvatarFallbackName", () => {
		it("should generate initials from name", () => {
			expect(getAvatarFallbackName("John Doe")).toBe("JO");
			expect(getAvatarFallbackName("alice wonderland")).toBe("AL");
		});
	});

	describe("formatKs", () => {
		it("should format currency with Ks suffix and commas", () => {
			expect(formatKs(100)).toBe("100 Ks");
			expect(formatKs(1000)).toBe("1,000 Ks");
			expect(formatKs(1000000)).toBe("1,000,000 Ks");
		});
	});

	describe("formatInLakhsCrores", () => {
		it("should format crores correctly", () => {
			expect(formatInLakhsCrores(10000000)).toBe("1.00 crore Ks");
			expect(formatInLakhsCrores(15000000)).toBe("1.50 crore Ks");
		});

		it("should format lakhs correctly", () => {
			expect(formatInLakhsCrores(100000)).toBe("1.00 lakh Ks");
			expect(formatInLakhsCrores(150000)).toBe("1.50 lakh Ks");
			expect(formatInLakhsCrores(9999999)).toBe("100.00 lakh Ks"); // < 1 crore
		});

		it("should format standard Ks for small amounts", () => {
			expect(formatInLakhsCrores(50000)).toBe("50,000 Ks");
			expect(formatInLakhsCrores(99999)).toBe("99,999 Ks");
		});
	});

	describe("companyProfitAndPercentageCalculator", () => {
		it("should calculate company profit correctly", () => {
			const result = companyProfitAndPercentageCalculator(100000, 30);
			expect(result.companyPercentage).toBe(70);
			expect(result.companyProfit).toBe(70000);
		});

		it("should round profit to nearest integer", () => {
			// 100 * 69.9% = 69.9 -> 70
			const result = companyProfitAndPercentageCalculator(100, 30.1);
			expect(result.companyPercentage).toBe(69.9);
			expect(result.companyProfit).toBe(70);
		});
	});

	describe("shareholderProfitAndPercentageCalculator", () => {
		it("should calculate shareholder profit correctly", () => {
			const result = shareholderProfitAndPercentageCalculator(100000, 30);
			expect(result.shareholderPercentage).toBe(30);
			expect(result.shareholderProfit).toBe(30000);
		});

		it("should round profit to nearest integer", () => {
			// 100 * 30.1% = 30.1 -> 30
			const result = shareholderProfitAndPercentageCalculator(100, 30.1);
			expect(result.shareholderPercentage).toBe(30.1);
			expect(result.shareholderProfit).toBe(30);
		});
	});

	describe("roundToSixDecimals", () => {
		it("should round to 6 decimal places", () => {
			expect(roundToSixDecimals(0.1234567)).toBe(0.123457);
			expect(roundToSixDecimals(0.123456789 + 0.23456789)).toBe(0.358025); // 0.358024679
		});
	});

	describe("formatPercentage", () => {
		it("should format percentage strings correctly", () => {
			expect(formatPercentage(30.0)).toBe("30");
			expect(formatPercentage(33.3333333)).toBe("33.333333");
			expect(formatPercentage(25.501)).toBe("25.501");
		});
	});

	describe("parsePercentageInput", () => {
		it("should return the number for valid input", () => {
			expect(parsePercentageInput("30")).toBe(30);
			expect(parsePercentageInput("30.5")).toBe(30.5);
		});

		it("should clamp values between 0 and 100", () => {
			expect(parsePercentageInput("-10")).toBe(0);
			expect(parsePercentageInput("150")).toBe(100);
		});

		it("should return 0 for NaN input", () => {
			expect(parsePercentageInput("abc")).toBe(0);
			expect(parsePercentageInput("")).toBe(0); // NaN
		});
	});

	describe("parseAmountInput", () => {
		it("should parse valid amounts", () => {
			expect(parseAmountInput("1000")).toBe(1000);
		});

		it("should return 0 for invalid inputs", () => {
			expect(parseAmountInput("abc")).toBe(0);
			expect(parseAmountInput("-50")).toBe(0);
		});

		it("should clamp to max value if provided", () => {
			expect(parseAmountInput("5000", 1000)).toBe(1000);
			expect(parseAmountInput("500", 1000)).toBe(500);
		});

		it("should round to 6 decimals", () => {
			expect(parseAmountInput("10.1234567")).toBe(10.123457);
		});
	});

	describe("calculatePercentageFromAmount", () => {
		it("should calculate percentage correctly", () => {
			expect(calculatePercentageFromAmount(30, 100)).toBe(30);
			expect(calculatePercentageFromAmount(1, 3)).toBe(33.333333); // 1/3 * 100
		});

		it("should return 0 if price is 0", () => {
			expect(calculatePercentageFromAmount(100, 0)).toBe(0);
		});
	});

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
});
