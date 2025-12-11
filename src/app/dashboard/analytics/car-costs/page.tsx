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

type CarCost = {
	car: string;
	buyPrice: string;
	repairs: string;
	transport: string;
	cleaning: string;
	other: string;
	totalCost: string;
	profitAfterCost: string;
};

const data: CarCost[] = [
	{
		car: "Toyota Vigo 2014",
		buyPrice: "430,000 THB",
		repairs: "8,000 THB",
		transport: "2,500 THB",
		cleaning: "500 THB",
		other: "1,000 THB",
		totalCost: "442,000 THB",
		profitAfterCost: "138,000 THB",
	},
	{
		car: "Honda City 2018",
		buyPrice: "350,000 THB",
		repairs: "4,500 THB",
		transport: "1,500 THB",
		cleaning: "400 THB",
		other: "0 THB",
		totalCost: "356,400 THB",
		profitAfterCost: "63,600 THB",
	},
	{
		car: "Mazda 2 2015",
		buyPrice: "260,000 THB",
		repairs: "6,000 THB",
		transport: "1,000 THB",
		cleaning: "350 THB",
		other: "800 THB",
		totalCost: "268,150 THB",
		profitAfterCost: "46,850 THB",
	},
];

const columns: ColumnDef<CarCost>[] = [
	{ accessorKey: "car", header: "Car" },
	{ accessorKey: "buyPrice", header: "Buy Price" },
	{ accessorKey: "repairs", header: "Repairs" },
	{ accessorKey: "transport", header: "Transport" },
	{ accessorKey: "cleaning", header: "Cleaning" },
	{ accessorKey: "other", header: "Other Costs" },
	{ accessorKey: "totalCost", header: "Total Cost" },
	{ accessorKey: "profitAfterCost", header: "Profit After Cost" },
];

export default function Page() {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="p-6">
			<h1 className="text-xl font-bold mb-4">Car Cost Breakdown</h1>

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
