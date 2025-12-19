import { queryOptions, useQuery } from "@tanstack/react-query";
import { getExpenses } from "../actions/get-expenses";

export const getExpensesQueryOptions = queryOptions({
	queryKey: ["expenses"],
	queryFn: getExpenses,
	staleTime: 1000 * 60 * 5, // 5 minutes
});

export const useExpenses = () => {
	return useQuery(getExpensesQueryOptions);
};
