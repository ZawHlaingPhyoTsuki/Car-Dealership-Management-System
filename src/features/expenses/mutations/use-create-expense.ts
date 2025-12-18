import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createExpense } from "../actions/create-expense";
import { getExpensesQueryOptions } from "../queries/get-expenses";

export const useCreateExpense = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createExpense,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: getExpensesQueryOptions.queryKey,
			});
			toast.success("Expense created successfully");
		},
		onError: () => {
			toast.error("Failed to create expense");
		},
	});
};
