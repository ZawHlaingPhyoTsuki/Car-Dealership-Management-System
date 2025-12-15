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
import { useDeleteExpense } from "../mutations/use-delete-expense";

interface DeleteExpenseDialogProps {
	expenseId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeleteExpenseDialog({
	expenseId,
	open,
	onOpenChange,
}: DeleteExpenseDialogProps) {
	const deleteExpenseMutation = useDeleteExpense();

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete this
						expense record.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className="bg-destructive text-white hover:bg-destructive/90"
						disabled={deleteExpenseMutation.isPending}
						onClick={async (e) => {
							// Prevent auto-close until the mutation succeeds (Radix default behavior).
							e.preventDefault();
							await deleteExpenseMutation.mutateAsync(expenseId);
							onOpenChange(false);
						}}
					>
						{deleteExpenseMutation.isPending ? "Deleting..." : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
