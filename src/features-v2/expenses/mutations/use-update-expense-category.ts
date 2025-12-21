import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateExpenseCategory } from "../actions/update-expense-category";
import { getExpenseCategoriesQueryOptions } from "../queries/get-expense-category";
import { getExpensesQueryOptions } from "../queries/get-expenses";

export const useUpdateExpenseCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateExpenseCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: getExpenseCategoriesQueryOptions.queryKey,
			});
			queryClient.invalidateQueries({
				queryKey: getExpensesQueryOptions.queryKey,
			});
			toast.success("Expense category updated successfully");
		},
		onError: () => {
			toast.error("Failed to update expense category");
		},
	});
};
