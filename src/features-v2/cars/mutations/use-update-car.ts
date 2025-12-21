import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCar } from "../actions/update-car";
import { getCarsQueryOptions } from "../queries/use-cars";

export const useUpdateCar = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateCar,
		onSuccess: () => {
			toast.success("Car updated successfully");
			queryClient.invalidateQueries({
				queryKey: getCarsQueryOptions.queryKey,
			});
		},
		onError: (error) => {
			toast.error("Failed to update car");
			console.error(error);
		},
	});
};
