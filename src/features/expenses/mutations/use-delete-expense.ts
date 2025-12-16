"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteExpense } from "../actions/delete-expense";
import { getExpensesQueryOptions } from "../queries/get-expenses";

export const useDeleteExpense = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteExpense,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: getExpensesQueryOptions.queryKey,
			});
			toast.success("Expense deleted successfully");
		},
		onError: () => {
			toast.error("Failed to delete expense");
		},
	});
};
