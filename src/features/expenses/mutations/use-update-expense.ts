import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateExpense } from "../actions/update-expense";
import { getExpensesQueryOptions } from "../queries/get-expenses";

export const useUpdateExpense = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateExpense,
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
