"use client";

import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useState } from "react";
import { DataTableColumnHeader } from "@/components/shared/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatInLakhsCrores } from "@/lib/utils";
import type { Expense } from "../actions/get-expenses";
import { DeleteExpenseDialog } from "./delete-expense-dialog";
import EditExpenseDialog from "./edit-expense-dialog";

export const columns: ColumnDef<Expense>[] = [
	{
		id: "no.",
		header: "No.",
		cell: ({ row }) => row.index + 1,
	},
	{
		accessorKey: "date",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Paid At" />
		),
		cell: ({ row }) => {
			const date = row.original.date;
			if (!date) return "N/A";
			const d = typeof date === "string" ? new Date(date) : date;
			return Number.isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString("en-US");
		},
	},
	{
		accessorKey: "amount",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Amount" />
		),
		cell: ({ row }) => {
			const amount = Number.parseFloat(row.getValue("amount"));
			if (Number.isNaN(amount)) return "_";
			const formatted = formatInLakhsCrores(amount);
			return formatted;
		},
	},
	{
		accessorKey: "name",
		accessorFn: (row) => row.paidTo?.name ?? "",
		header: "Employee",
		cell: ({ row }) => {
			const employee = row.original.paidTo;
			if (!employee) return "_";
			return (
				<div className="flex items-center gap-3 min-w-0">
					{/* {employee.photos.length > 0 ? (
						<Image
							src={employee.photos[0].url}
							alt={employee.name}
							width={50}
							height={30}
							className="rounded-md object-cover shrink-0"
						/>
					) : ( */}
					<div className="h-[50px] w-[50px] rounded-md bg-gray-100 flex items-center justify-center shrink-0">
						<span className="text-xs text-gray-500">No image</span>
					</div>
					{/* )} */}
					<div className="min-w-0">
						<div className="font-medium truncate">{employee.name}</div>

						{employee.phone && (
							<div className="text-sm text-gray-500 truncate">
								{employee.phone}
							</div>
						)}
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "car",
		header: "Car",
		cell: ({ row }) => {
			const car = row.original.car;
			if (!car) return "_";
			return (
				<div className="flex items-center gap-3 min-w-0">
					{car.photos.length > 0 ? (
						<Image
							src={car.photos[0].url}
							alt={car.name}
							width={50}
							height={30}
							className="rounded-md object-cover shrink-0"
						/>
					) : (
						<div className="h-[50px] w-[50px] rounded-md bg-gray-100 flex items-center justify-center shrink-0">
							<span className="text-xs text-gray-500">No image</span>
						</div>
					)}
					<div className="min-w-0">
						<div className="font-medium truncate">{car.name}</div>

						{car.color && (
							<div className="text-sm text-gray-500 truncate">{car.color}</div>
						)}
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "category",
		header: "Category",
		cell: ({ row }) => row.original.category,
	},
	{
		accessorKey: "notes",
		header: "Notes",
		cell: ({ row }) => {
			const notes = row.original.notes ?? "";
			if (!notes) return "_";

			const preview = notes.length > 10 ? `${notes.slice(0, 10)}...` : notes;
			return (
				<HoverCard>
					<HoverCardTrigger asChild>
						<span className="cursor-pointer text-muted-foreground">
							{preview}
						</span>
					</HoverCardTrigger>

					<HoverCardContent className="max-w-sm wrap-break-word">
						{notes}
					</HoverCardContent>
				</HoverCard>
			);
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const expense = row.original;

			return <ExpenseActionsCell expense={expense} />;
		},
	},
];

function ExpenseActionsCell({ expense }: { expense: Expense }) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		<>
			<EditExpenseDialog
				expense={expense}
				open={editOpen}
				onOpenChange={setEditOpen}
			/>
			<DeleteExpenseDialog
				expenseId={expense.id}
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
}
