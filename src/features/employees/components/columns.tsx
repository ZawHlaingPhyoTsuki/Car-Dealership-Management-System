"use client";

import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import type { Employee } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
		id: "index",
		header: "No.",
		cell: ({ row }) => row.index + 1,
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => row.original.name,
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => row.original.email,
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
		accessorKey: "address",
		header: "Address",
		cell: ({ row }) => row.original.address,
	},
	{
		accessorKey: "salary",
		header: "Salary",
		cell: ({ row }) => {
			const salary = row.original.salary;
			return new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
				minimumFractionDigits: 0,
			}).format(salary);
		},
	},
	{
		accessorKey: "startDate",
		header: "Start Date",
		cell: ({ row }) => {
			const date = row.original.startDate;
			return date ? date.toLocaleDateString("en-US") : "N/A";
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const employee = row.original;
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
								<IconDotsVertical />
								<span className="sr-only">Open menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-32">
							<DropdownMenuItem
								className="flex items-center gap-2 w-full"
								onSelect={() => setEditOpen(true)}
							>
								<IconEdit className="h-4 w-4" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								variant="destructive"
								className="flex items-center gap-2 w-full"
								onSelect={() => setDeleteOpen(true)}
							>
								<IconTrash className="h-4 w-4" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			);
		},
	},
];
