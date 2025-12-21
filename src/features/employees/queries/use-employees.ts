import { queryOptions, useQuery } from "@tanstack/react-query";
import { getEmployees } from "../actions/get-employees";

export const getEmployeesQueryOptions = queryOptions({
	queryKey: ["employees"],
	queryFn: getEmployees,
});

export const useEmployees = () => {
	return useQuery(getEmployeesQueryOptions);
};
