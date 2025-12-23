import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadCarImage } from "../actions/upload-car-image";
import { getCarsQueryOptions } from "../queries/use-cars";

export const useUploadCarImage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: uploadCarImage,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getCarsQueryOptions.queryKey });
			toast.success("Image uploaded successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to upload image");
		},
	});
};
