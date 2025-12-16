"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, SquarePen, Trash } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { formatInLakhsCrores } from "@/lib/utils";
import type { Expense } from "../actions/get-expenses";
import { DeleteExpenseDialog } from "./delete-expense-dialog";
import EditExpenseDialog from "./edit-expense-dialog";
import { dateBetweenFilter } from "./filterFn";

export const columns: ColumnDef<Expense>[] = [
	{
		id: "no.",
		header: () => <Label className="text-lg">No.</Label>,
		cell: ({ row }) => row.index + 1,
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
		id: "category",
		accessorFn: (row) => row.category?.id ?? null,
		header: () => <Label className="text-lg">Reason</Label>,
		cell: ({ row }) => row.original.category?.name ?? "_",
		filterFn: "equalsString",
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
		filterFn: dateBetweenFilter,
	},
	{
		accessorKey: "name",
		accessorFn: (row) => row.paidTo?.name ?? "",
		header: () => <Label className="text-lg">Employee</Label>,
		cell: ({ row }) => {
			const employee = row.original.paidTo;
			if (!employee) return "_";
			return (
				<div className="min-w-0">
					<div className="font-medium truncate">{employee.name}</div>
					{employee.position && (
						<div className="text-sm text-gray-500 truncate">
							{employee.position}
						</div>
					)}
				</div>
			);
		},
	},
	{
		id: "car",
		accessorFn: (row) => row.car?.id ?? null,
		header: () => <Label className="text-lg">Car</Label>,
		cell: ({ row }) => {
			const car = row.original.car;
			if (!car) return "_";
			return (
				<div className="flex items-center gap-3 min-w-0">
					<div className="min-w-0">
						<div className="font-medium truncate">{car.name}</div>
						{car.licenseNumber && (
							<div className="text-sm text-gray-500 truncate">
								{car.licenseNumber}
							</div>
						)}
					</div>
				</div>
			);
		},
		filterFn: "equalsString",
	},

	{
		accessorKey: "notes",
		header: () => <Label className="text-lg">Notes</Label>,
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
		header: () => <Label className="text-lg">Actions</Label>,
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
						<EllipsisVertical />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-32">
					<DropdownMenuItem
						className="flex items-center gap-2 w-full"
						onSelect={() => setEditOpen(true)}
					>
						<SquarePen className="h-4 w-4" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem
						variant="destructive"
						className="flex items-center gap-2 w-full"
						onSelect={() => setDeleteOpen(true)}
					>
						<Trash className="h-4 w-4" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
