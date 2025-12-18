import type { CarProfitSummary } from "./actions/get-car-profit";

export function mapCarProfitForExport(carProfit: CarProfitSummary) {
	return {
		month: carProfit.month,
		carsSold: carProfit.carsSold,
		totalProfit: carProfit.totalProfit,
	};
}
