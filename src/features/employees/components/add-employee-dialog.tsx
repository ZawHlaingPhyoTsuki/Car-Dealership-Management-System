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
import AddEmployeeForm from "./add-employee-form";

export default function AddEmployeeDialog() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="default">
					<Plus className="h-4 w-4" />
					Add Employee
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Employee</DialogTitle>
					<DialogDescription>
						Add a new employee to the company.
					</DialogDescription>
				</DialogHeader>
				<AddEmployeeForm onClose={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}
