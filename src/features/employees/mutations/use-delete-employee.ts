"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
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
		},
		onError: () => {
			console.error("Failed to delete employee");
			// You can show toast here
		},
	});
};
