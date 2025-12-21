import { queryOptions, useQuery } from "@tanstack/react-query";
import { getExpenseCategories } from "../actions/get-expense-category";

export const getExpenseCategoriesQueryOptions = queryOptions({
	queryKey: ["expense-categories"],
	queryFn: getExpenseCategories,
});

export const useExpenseCategories = () => {
	return useQuery(getExpenseCategoriesQueryOptions);
};
