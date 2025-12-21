"use client";

import type { Dispatch, SetStateAction } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Employee } from "../actions/get-employees";
import EditEmployeeForm from "./edit-employee-form";

interface EditEmployeeDialogProps {
	employee: Employee;
	open: boolean;
	onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export default function EditEmployeeDialog({
	employee,
	open,
	onOpenChange,
}: EditEmployeeDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Employee</DialogTitle>
					<DialogDescription>Update employee information.</DialogDescription>
				</DialogHeader>
				<EditEmployeeForm
					employee={employee}
					onClose={() => onOpenChange(false)}
				/>
			</DialogContent>
		</Dialog>
	);
}
