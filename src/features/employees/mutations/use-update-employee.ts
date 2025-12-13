"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type z from "zod";
import { updateEmployee } from "../actions/update-employee";
import { getEmployeesQueryOptions } from "../queries/get-employees";
import type { UpdateEmployeeSchema } from "../validation";

export const useUpdateEmployee = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: z.infer<typeof UpdateEmployeeSchema>;
		}) => updateEmployee(id, data),
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
