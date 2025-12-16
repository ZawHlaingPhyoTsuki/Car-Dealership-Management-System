"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteExpenseCategory } from "../actions/delete-expense-category";
import { getExpenseCategoriesQueryOptions } from "../queries/get-expense-category";
import { getExpensesQueryOptions } from "../queries/get-expenses";

export const useDeleteExpenseCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteExpenseCategory,
		onSuccess: () => {
			toast.success("Expense category deleted successfully");
			queryClient.invalidateQueries({
				queryKey: getExpenseCategoriesQueryOptions.queryKey,
			});
			queryClient.invalidateQueries({
				queryKey: getExpensesQueryOptions.queryKey,
			});
		},
		onError: () => {
			toast.error("Failed to delete expense category");
		},
	});
};
