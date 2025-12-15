import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createShareholder } from "../actions/create-shareholder";
import { getShareholdersQueryOptions } from "../queries/use-car-sharer";

export const useCreateCarSharer = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createShareholder,
		onSuccess: () => {
			toast.success("Shareholder created successfully");
			queryClient.invalidateQueries({
				queryKey: getShareholdersQueryOptions.queryKey,
			});
		},
		onError: (error) => {
			console.error(error);
			toast.error("Failed to create shareholder");
		},
	});
};
