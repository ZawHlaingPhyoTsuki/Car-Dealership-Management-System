import { queryOptions, useQuery } from "@tanstack/react-query";
import { getCarProfitSummary } from "../actions/get-car-profit";

export const getCarProfitSummaryQueryOptions = queryOptions({
	queryKey: ["car-profit-summary"],
	queryFn: () => getCarProfitSummary(),
});

export const useCarProfitSummary = () => {
	return useQuery(getCarProfitSummaryQueryOptions);
};
