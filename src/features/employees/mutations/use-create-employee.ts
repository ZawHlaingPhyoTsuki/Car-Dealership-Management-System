"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployee } from "../actions/create-employee";
import { getEmployeesQueryOptions } from "../queries/get-employees";

export const useCreateEmployee = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createEmployee,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: getEmployeesQueryOptions.queryKey,
			});
		},
		onError: (error) => {
			console.error("Failed to create employee:", error);
			// You can show toast here
		},
	});
};
