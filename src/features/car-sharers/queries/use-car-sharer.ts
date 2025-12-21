import { queryOptions, useQuery } from "@tanstack/react-query";
import { getShareholders } from "../actions/get-shareholders";

export const getShareholdersQueryOptions = queryOptions({
	queryKey: ["shareholders"],
	queryFn: getShareholders,
});

export const useGetShareholders = () => {
	return useQuery(getShareholdersQueryOptions);
};
