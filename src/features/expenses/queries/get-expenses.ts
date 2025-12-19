import { queryOptions, useQuery } from "@tanstack/react-query";
import { getExpenses } from "../actions/get-expenses";

export const getExpensesQueryOptions = queryOptions({
	queryKey: ["expenses"],
	queryFn: getExpenses,
});

export const useExpenses = () => {
	return useQuery(getExpensesQueryOptions);
};
