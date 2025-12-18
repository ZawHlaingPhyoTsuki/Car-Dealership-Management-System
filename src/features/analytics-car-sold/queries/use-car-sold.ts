import { queryOptions, useQuery } from "@tanstack/react-query";
import { getCarsSold } from "../actions/get-car-sold";

export const getCarsSoldQueryOptions = queryOptions({
	queryKey: ["car-sold"],
	queryFn: () => getCarsSold(),
});

export const useCarsSold = () => {
	return useQuery(getCarsSoldQueryOptions);
};
