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
import AddExpenseForm from "./add-expense-form";

export default function AddExpenseDialog() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="default">
					<Plus className="h-4 w-4" />
					Add Expense
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Expense</DialogTitle>
					<DialogDescription>Add a new expense for spending.</DialogDescription>
				</DialogHeader>
				<AddExpenseForm onClose={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}
