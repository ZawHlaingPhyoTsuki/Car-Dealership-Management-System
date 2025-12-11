"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type Expense = {
	date: string;
	employee: string;
	amount: string;
	car: string;
	category: string;
	notes: string;
};

const data: Expense[] = [
	{
		date: "2025-02-08",
		employee: "Aung Ko",
		amount: "1,000 THB",
		car: "Toyota Vigo 2014",
		category: "CLEANING_DETAILING",
		notes: "Car wash",
	},
	{
		date: "2025-02-07",
		employee: "Min Thu",
		amount: "850 THB",
		car: "-",
		category: "OFFICE_SUPPLIES",
		notes: "Printer ink",
	},
	{
		date: "2025-02-06",
		employee: "Sai Htet",
		amount: "1,500 THB",
		car: "Honda City 2018",
		category: "TRANSPORT",
		notes: "Auction transport fee",
	},
];

const columns: ColumnDef<Expense>[] = [
	{ accessorKey: "date", header: "Date" },
	{ accessorKey: "employee", header: "Employee" },
	{ accessorKey: "amount", header: "Amount" },
	{ accessorKey: "car", header: "Car" },
	{ accessorKey: "category", header: "Category" },
	{ accessorKey: "notes", header: "Notes" },
	{
		id: "actions",
		header: "Actions",
		cell: () => (
			<div className="flex gap-2">
				<Ellipsis className="w-4 h-4" />
			</div>
		),
	},
];

export default function Page() {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="p-6">
			<h1 className="text-xl font-semibold mb-4">Recent Expenses</h1>

			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((hg) => (
						<TableRow key={hg.id}>
							{hg.headers.map((header) => (
								<TableHead key={header.id}>
									{flexRender(
										header.column.columnDef.header,
										header.getContext(),
									)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>

				<TableBody>
					{table.getRowModel().rows.map((row) => (
						<TableRow key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<TableCell key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
