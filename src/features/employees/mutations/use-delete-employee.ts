"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteEmployee } from "../actions/delete-employee";
import { getEmployeesQueryOptions } from "../queries/get-employees";

export const useDeleteEmployee = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteEmployee,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: getEmployeesQueryOptions.queryKey,
			});
			toast.success("Employee deleted successfully");
		},
		onError: () => {
			toast.error("Failed to delete employee");
		},
	});
};
