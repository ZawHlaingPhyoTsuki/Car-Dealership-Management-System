import { queryOptions, useQuery } from "@tanstack/react-query";
import { getCars } from "../actions/get-cars";

export const getCarsQueryOptions = queryOptions({
	queryKey: ["cars"],
	queryFn: getCars,
});

export const useGetCars = () => {
	return useQuery(getCarsQueryOptions);
};
