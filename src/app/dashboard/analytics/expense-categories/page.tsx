"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type ExpenseCategory = {
	category: string;
	total: string;
	percentage: string;
};

const data: ExpenseCategory[] = [
	{
		category: "CLEANING_DETAILING",
		total: "12,200 THB",
		percentage: "14%",
	},
	{
		category: "TRANSPORT",
		total: "25,000 THB",
		percentage: "30%",
	},
	{
		category: "REPAIRS",
		total: "34,000 THB",
		percentage: "41%",
	},
	{
		category: "OFFICE_SUPPLIES",
		total: "4,800 THB",
		percentage: "6%",
	},
	{
		category: "OTHER",
		total: "7,000 THB",
		percentage: "9%",
	},
];

const columns: ColumnDef<ExpenseCategory>[] = [
	{ accessorKey: "category", header: "Category" },
	{ accessorKey: "total", header: "Total Amount" },
	{ accessorKey: "percentage", header: "Percentage" },
];

export default function Page() {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="p-6">
			<h1 className="text-xl font-bold mb-4">Expense Category Summary</h1>

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
