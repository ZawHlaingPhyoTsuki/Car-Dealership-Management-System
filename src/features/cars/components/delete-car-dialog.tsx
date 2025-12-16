"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteCar } from "../mutations/use-delete-car";

interface DeleteCarDialogProps {
	id: string;
	name: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function DeleteCarDialog({
	id,
	name,
	open,
	onOpenChange,
}: DeleteCarDialogProps) {
	const deleteCarMutation = useDeleteCar();

	const handleDelete = async () => {
		await deleteCarMutation.mutateAsync(id);
		onOpenChange(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete{" "}
						<span className="font-medium text-foreground">{name}</span> from the
						database.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={deleteCarMutation.isPending}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						className="bg-destructive text-white hover:bg-destructive/90"
						onClick={handleDelete}
						disabled={deleteCarMutation.isPending}
					>
						{deleteCarMutation.isPending ? "Deleting..." : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
