"use client";

import type { Dispatch, SetStateAction } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { ExpenseTableData } from "./columns";
import EditExpenseForm from "./edit-expense-form";

interface EditExpenseDialogProps {
	expense: ExpenseTableData;
	open: boolean;
	onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export default function EditExpenseDialog({
	expense,
	open,
	onOpenChange,
}: EditExpenseDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Expense</DialogTitle>
					<DialogDescription>Update expense information.</DialogDescription>
				</DialogHeader>
				<EditExpenseForm
					expense={expense}
					onClose={() => onOpenChange(false)}
				/>
			</DialogContent>
		</Dialog>
	);
}
