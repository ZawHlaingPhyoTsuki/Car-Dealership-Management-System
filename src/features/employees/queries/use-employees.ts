"use client";

import { queryOptions, useQuery } from "@tanstack/react-query";
import { getEmployees } from "../actions/get-employees";

export const getEmployeesQueryOptions = queryOptions({
	queryKey: ["employees"],
	queryFn: getEmployees,
	staleTime: 1000 * 60 * 5,
});

export const useEmployees = () => {
	return useQuery(getEmployeesQueryOptions);
};
