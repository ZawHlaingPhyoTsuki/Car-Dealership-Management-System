"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createEmployee } from "../actions/create-employee";
import { getEmployeesQueryOptions } from "../queries/use-employees";

export const useCreateEmployee = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createEmployee,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: getEmployeesQueryOptions.queryKey,
			});
			toast.success("Employee created successfully");
		},
		onError: () => {
			toast.error("Failed to create employee");
		},
	});
};
