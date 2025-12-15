"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, EllipsisVertical, Trash } from "lucide-react";
import { useState } from "react";
import type { Employee } from "@/app/generated/prisma/client";
import { DataTableColumnHeader } from "@/components/shared/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatInLakhsCrores } from "@/lib/utils";
import { DeleteEmployeeDialog } from "./delete-employee-dialog";
import EditEmployeeDialog from "./edit-employee-dialog";

export type EmployeeTableData = Pick<
	Employee,
	| "id"
	| "name"
	| "email"
	| "position"
	| "phone"
	| "address"
	| "salary"
	| "startDate"
>;

export const columns: ColumnDef<EmployeeTableData>[] = [
	{
		id: "no.",
		header: "No.",
		cell: ({ row }) => row.index + 1,
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => row.original.name,
	},

	{
		accessorKey: "salary",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Salary" />
		),
		cell: ({ row }) => {
			const salary = row.original.salary;
			return formatInLakhsCrores(salary);
		},
	},
	{
		accessorKey: "position",
		header: "Position",
		cell: ({ row }) => row.original.position,
	},
	{
		accessorKey: "phone",
		header: "Phone",
		cell: ({ row }) => row.original.phone,
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => row.original.email,
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
		accessorKey: "address",
		header: "Address",
		cell: ({ row }) => row.original.address,
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const employee = row.original;

			return <EmployeeActionsCell employee={employee} />;
		},
	},
];

function EmployeeActionsCell({ employee }: { employee: EmployeeTableData }) {
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
