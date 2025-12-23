import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteCarImage } from "../actions/delete-car-image";
import { getCarsQueryOptions } from "../queries/use-cars";

export const useDeleteCarImage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteCarImage,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getCarsQueryOptions.queryKey });
			toast.success("Image deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete image");
		},
	});
};
