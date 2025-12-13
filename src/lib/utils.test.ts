import { describe, expect, it } from "vitest";
import {
	companyProfitAndPercentageCalculator,
	formatInLakhsCrores,
	formatKs,
	shareholderProfitAndPercentageCalculator,
} from "./utils";

describe("Utility Functions", () => {
	describe("formatKs", () => {
		it("should format number as Myanmar Kyat string", () => {
			expect(formatKs(1000)).toBe("Ks 1,000");
			expect(formatKs(1234567)).toBe("Ks 1,234,567");
			expect(formatKs(0)).toBe("Ks 0");
		});
	});

	describe("formatInLakhsCrores", () => {
		it("should format numbers >= 1 crore correctly", () => {
			expect(formatInLakhsCrores(10000000)).toBe("1.00 crore MMK");
			expect(formatInLakhsCrores(15000000)).toBe("1.50 crore MMK");
			expect(formatInLakhsCrores(23450000)).toBe("2.35 crore MMK");
		});

		it("should format numbers >= 1 lakh but < 1 crore correctly", () => {
			expect(formatInLakhsCrores(100000)).toBe("1.00 lakh MMK");
			expect(formatInLakhsCrores(150000)).toBe("1.50 lakh MMK");
			expect(formatInLakhsCrores(9999999)).toBe("100.00 lakh MMK"); // Edge case near crore boundary
		});

		it("should format numbers < 1 lakh using formatKs", () => {
			expect(formatInLakhsCrores(99999)).toBe("Ks 99,999");
			expect(formatInLakhsCrores(500)).toBe("Ks 500");
			expect(formatInLakhsCrores(0)).toBe("Ks 0");
		});
	});

	describe("companyProfitAndPercentageCalculator", () => {
		it("should calculate correct company profit and percentage based on shareholder percentage", () => {
			// 20% shareholder -> 80% company
			const result1 = companyProfitAndPercentageCalculator(100000, 20);
			expect(result1.companyPercentage).toBe(80);
			expect(result1.companyProfit).toBe(80000);

			// 50% shareholder -> 50% company
			const result2 = companyProfitAndPercentageCalculator(50000, 50);
			expect(result2.companyPercentage).toBe(50);
			expect(result2.companyProfit).toBe(25000);

			// 0% shareholder -> 100% company
			const result3 = companyProfitAndPercentageCalculator(1000, 0);
			expect(result3.companyPercentage).toBe(100);
			expect(result3.companyProfit).toBe(1000);
		});
	});

	describe("shareholderProfitAndPercentageCalculator", () => {
		it("should calculate correct shareholder profit and return percentage", () => {
			// 20% shareholder
			const result1 = shareholderProfitAndPercentageCalculator(100000, 20);
			expect(result1.shareholderPercentage).toBe(20);
			expect(result1.shareholderProfit).toBe(20000);

			// 50% shareholder
			const result2 = shareholderProfitAndPercentageCalculator(50000, 50);
			expect(result2.shareholderPercentage).toBe(50);
			expect(result2.shareholderProfit).toBe(25000);

			// 0% shareholder
			const result3 = shareholderProfitAndPercentageCalculator(1000, 0);
			expect(result3.shareholderPercentage).toBe(0);
			expect(result3.shareholderProfit).toBe(0);
		});
	});
});
