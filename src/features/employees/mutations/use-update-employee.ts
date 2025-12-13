"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Prisma } from "@/app/generated/prisma/client";
import { updateEmployee } from "../actions/update-employee";
import { getEmployeesQueryOptions } from "../queries/get-employees";

export const useUpdateEmployee = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: Prisma.EmployeeUpdateInput;
		}) => updateEmployee(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: getEmployeesQueryOptions.queryKey,
			});
			toast.success("Employee updated successfully");
		},
		onError: () => {
			toast.error("Failed to update employee");
		},
	});
};
