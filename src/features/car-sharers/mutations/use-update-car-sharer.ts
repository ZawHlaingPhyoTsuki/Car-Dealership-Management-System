import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCarsQueryOptions } from "@/features/cars/queries/use-get-cars";
import { updateCarSharer } from "../actions/update-car-sharer";

export const useUpdateCarSharer = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateCarSharer,
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
