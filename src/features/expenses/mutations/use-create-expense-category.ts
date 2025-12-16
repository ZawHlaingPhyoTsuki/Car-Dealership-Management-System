"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createExpenseCategory } from "../actions/create-expense-category";
import { getExpenseCategoriesQueryOptions } from "../queries/get-expense-category";
import { getExpensesQueryOptions } from "../queries/get-expenses";

export const useCreateExpenseCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createExpenseCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: getExpenseCategoriesQueryOptions.queryKey,
			});
			queryClient.invalidateQueries({
				queryKey: getExpensesQueryOptions.queryKey,
			});
			toast.success("Expense category created successfully");
		},
		onError: () => {
			toast.error("Failed to create expense category");
		},
	});
};
