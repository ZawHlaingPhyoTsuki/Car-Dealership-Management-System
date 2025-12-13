import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCar } from "../actions/create-car";
import { getCarsQueryOptions } from "../queries/use-get-cars";
import type { CreateCarValues } from "../validation";

export const useCreateCar = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (values: CreateCarValues) => createCar(values),
		onSuccess: () => {
			toast.success("Car created successfully");
			queryClient.invalidateQueries({
				queryKey: getCarsQueryOptions.queryKey,
			});
		},
		onError: (error) => {
			toast.error("Failed to create car");
			console.error(error);
		},
	});
};
