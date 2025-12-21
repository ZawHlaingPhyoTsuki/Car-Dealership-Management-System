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
import { useDeleteEmployee } from "../mutations/use-delete-employee";

interface DeleteEmployeeDialogProps {
	employeeId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeleteEmployeeDialog({
	employeeId,
	open,
	onOpenChange,
}: DeleteEmployeeDialogProps) {
	const deleteEmployeeMutation = useDeleteEmployee();

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete this
						employee record.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className="bg-destructive text-white hover:bg-destructive/90"
						disabled={deleteEmployeeMutation.isPending}
						onClick={async (e) => {
							// Prevent auto-close until the mutation succeeds (Radix default behavior).
							e.preventDefault();
							await deleteEmployeeMutation.mutateAsync(employeeId);
							onOpenChange(false);
						}}
					>
						{deleteEmployeeMutation.isPending ? "Deleting..." : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
