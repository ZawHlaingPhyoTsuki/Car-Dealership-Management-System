"use client";

import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import type { Expense } from "@/app/generated/prisma/client";
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
import { expenseFormatter } from "@/lib/utils";
import { DeleteExpenseDialog } from "./delete-expense-dialog";
import EditExpenseDialog from "./edit-expense-dialog";

export type ExpenseTableData = Pick<
	Expense,
	"id" | "date" | "amount" | "category" | "notes"
> & {
	paidTo?: {
		id: string;
		name: string;
	} | null;
	car?: {
		id: string;
		name: string;
	} | null;
};

export const columns: ColumnDef<ExpenseTableData>[] = [
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
			const amount = row.original.amount;
			return expenseFormatter.format(amount);
		},
	},
	{
		accessorKey: "name",
		accessorFn: (row) => row.paidTo?.name ?? "",
		header: "Employee",
		cell: ({ row }) => row.original.paidTo?.name ?? "_",
	},
	{
		accessorKey: "car",
		header: "Car",
		cell: ({ row }) => row.original.car?.name ?? "_",
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

function ExpenseActionsCell({ expense }: { expense: ExpenseTableData }) {
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
