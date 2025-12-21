"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateEmployee } from "../actions/update-employee";
import { getEmployeesQueryOptions } from "../queries/use-employees";

export const useUpdateEmployee = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateEmployee,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: getEmployeesQueryOptions.queryKey,
			});
			toast.success("Employee updated successfully");
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Failed to update employee",
			);
		},
	});
};
