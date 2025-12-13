import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getAvatarFallbackName(name: string): string {
	return name.charAt(0).toUpperCase() + name.charAt(1).toUpperCase();
}

export const formatKs = (amount: number): string => {
	return `Ks ${amount.toLocaleString("en-US")}`;
};

export const formatInLakhsCrores = (amount: number): string => {
	if (amount >= 10000000) {
		// 1 crore = 10 million (10,000,000)
		const crores = amount / 10000000;
		return `${crores.toFixed(2)} crore MMK`;
	} else if (amount >= 100000) {
		// 1 lakh = 100,000
		const lakhs = amount / 100000;
		return `${lakhs.toFixed(2)} lakh MMK`;
	} else {
		return formatKs(amount);
	}
};

export const companyProfitAndPercentageCalculator = (
	price: number,
	shareholderPercentage: number,
) => {
	const companyPercentage = 100 - shareholderPercentage;
	const companyProfit = (price * companyPercentage) / 100;
	return { companyProfit, companyPercentage };
};

export const shareholderProfitAndPercentageCalculator = (
	price: number,
	shareholderPercentage: number,
) => {
	const shareholderProfit = (price * shareholderPercentage) / 100;
	return { shareholderProfit, shareholderPercentage };
};
