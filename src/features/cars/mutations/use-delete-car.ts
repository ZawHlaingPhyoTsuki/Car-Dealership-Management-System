import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteCar } from "../actions/delete-car";
import { getCarsQueryOptions } from "../queries/use-cars";

export const useDeleteCar = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteCar(id),
		onSuccess: () => {
			toast.success("Car deleted successfully");
			queryClient.invalidateQueries({
				queryKey: getCarsQueryOptions.queryKey,
			});
		},
		onError: (error) => {
			toast.error("Failed to delete car");
			console.error(error);
		},
	});
};
