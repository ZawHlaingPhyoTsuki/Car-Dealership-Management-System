"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, EllipsisVertical, Trash } from "lucide-react";
import { useState } from "react";
import { DataTableColumnHeader } from "@/components/shared/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { formatNumberSafe } from "@/lib/utils";
import type { Employee } from "../actions/get-employees";
import { DeleteEmployeeDialog } from "./delete-employee-dialog";
import EditEmployeeDialog from "./edit-employee-dialog";

export const columns: ColumnDef<Employee>[] = [
	{
		id: "no.",
		header: () => <Label className="text-lg">No.</Label>,
		cell: ({ row }) => row.index + 1,
	},
	{
		accessorKey: "name",
		header: () => <Label className="text-lg">Name</Label>,
		cell: ({ row }) => row.original.name,
	},

	{
		accessorKey: "salary",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Salary" />
		),
		cell: ({ row }) => {
			const salary = row.original.salary;
			return formatNumberSafe(salary);
		},
	},
	{
		accessorKey: "percentage",
		header: () => <Label className="text-lg">Percentage</Label>,
		cell: ({ row }) => {
			const percentage = row.original.percentage;
			if (percentage == null) return "-";
			return (
				<span className="text-sm text-purple-800 dark:text-purple-500">
					{percentage}%
				</span>
			);
		},
	},
	{
		id: "position",
		accessorFn: (row) => row.position ?? "",
		header: () => <Label className="text-lg">Position</Label>,
		cell: ({ row }) => row.original.position ?? "-",
	},
	{
		accessorKey: "startDate",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Start Date" />
		),
		cell: ({ row }) => {
			const date = row.original.startDate;
			if (!date) return "N/A";
			const d = typeof date === "string" ? new Date(date) : date;
			return Number.isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString("en-US");
		},
	},
	{
		id: "actions",
		header: () => <Label className="text-lg">Actions</Label>,
		cell: ({ row }) => {
			const employee = row.original;

			return <EmployeeActionsCell employee={employee} />;
		},
	},
];

function EmployeeActionsCell({ employee }: { employee: Employee }) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		<>
			<EditEmployeeDialog
				employee={employee}
				open={editOpen}
				onOpenChange={setEditOpen}
			/>
			<DeleteEmployeeDialog
				employeeId={employee.id}
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
						size="icon"
					>
						<EllipsisVertical />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-32">
					<DropdownMenuItem
						className="flex items-center gap-2 w-full"
						onSelect={() => setEditOpen(true)}
					>
						<Edit className="mr-2 h-4 w-4" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem
						variant="destructive"
						className="flex items-center gap-2 w-full"
						onSelect={() => setDeleteOpen(true)}
					>
						<Trash className="h-4 w-4 mr-2 " />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
