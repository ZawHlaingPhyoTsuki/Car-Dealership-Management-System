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

type ProfitSummary = {
	month: string;
	carsSold: number;
	totalProfit: string;
	ownerProfit: string;
	sharerProfit: string;
};

const data: ProfitSummary[] = [
	{
		month: "2025-01",
		carsSold: 7,
		totalProfit: "340,000 THB",
		ownerProfit: "220,000 THB",
		sharerProfit: "120,000 THB",
	},
	{
		month: "2025-02",
		carsSold: 5,
		totalProfit: "280,000 THB",
		ownerProfit: "190,000 THB",
		sharerProfit: "90,000 THB",
	},
];

const columns: ColumnDef<ProfitSummary>[] = [
	{ accessorKey: "month", header: "Month" },
	{ accessorKey: "carsSold", header: "Cars Sold" },
	{ accessorKey: "totalProfit", header: "Total Profit" },
	{ accessorKey: "ownerProfit", header: "Owner Profit" },
	{ accessorKey: "sharerProfit", header: "Sharer Profit" },
];

export default function Page() {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="p-6">
			<h1 className="text-xl font-semibold mb-4">Monthly Profit Summary</h1>

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
