"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import AddExpenseCategoryForm from "./add-expense-category-form";

export default function AddExpenseCategoryDialog() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="default">
					<Plus className="h-4 w-4" />
					Add Expense Reason
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Expense Reason</DialogTitle>
					<DialogDescription>Add a new expense reason.</DialogDescription>
				</DialogHeader>
				<AddExpenseCategoryForm onClose={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}
