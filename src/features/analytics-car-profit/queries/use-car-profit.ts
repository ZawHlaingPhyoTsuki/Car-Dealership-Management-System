import { useQuery } from "@tanstack/react-query";
import { getCarProfitSummary } from "../actions/get-car-profit";

export function getCarProfitSummaryQueryOptions() {
	return {
		queryKey: ["car-profit-summary"],
		queryFn: () => getCarProfitSummary(),
	};
}

export function useCarProfitSummary() {
	return useQuery(getCarProfitSummaryQueryOptions());
}
