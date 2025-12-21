import { queryOptions, useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../actions/get-dashboard";

export const getDashboardQueryOptions = queryOptions({
	queryKey: ["dashboard"],
	queryFn: () => getDashboardStats(),
	staleTime: 5 * 60 * 1000, // 5 minutes
});

export const useDashboardStats = () => {
	return useQuery(getDashboardQueryOptions);
};
