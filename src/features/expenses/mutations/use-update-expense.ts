"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";
import { updateExpense } from "../actions/update-expense";
import { getExpensesQueryOptions } from "../queries/get-expenses";
import type { UpdateExpenseSchema } from "../validation";

export const useUpdateExpense = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: z.infer<typeof UpdateExpenseSchema>;
		}) => updateExpense(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: getExpensesQueryOptions.queryKey,
			});
			toast.success("Expense updated successfully");
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Failed to update expense",
			);
		},
	});
};
