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

type SoldCar = {
	model: string;
	salePrice: string;
	sharer: string;
	commissionPct: string;
	commission: string;
	companyRevenue: string;
	soldDate: string;
};

const data: SoldCar[] = [
	{
		model: "Toyota Vigo 2014",
		salePrice: "580,000 THB",
		sharer: "Aung Ko",
		commissionPct: "10%",
		commission: "58,000 THB",
		companyRevenue: "522,000 THB",
		soldDate: "2025-02-08",
	},
	{
		model: "Honda City 2018",
		salePrice: "420,000 THB",
		sharer: "Min Thu",
		commissionPct: "5%",
		commission: "21,000 THB",
		companyRevenue: "399,000 THB",
		soldDate: "2025-02-07",
	},
	{
		model: "Nissan March 2016",
		salePrice: "290,000 THB",
		sharer: "Nyein Oo",
		commissionPct: "10%",
		commission: "29,000 THB",
		companyRevenue: "261,000 THB",
		soldDate: "2025-02-06",
	},
];

const columns: ColumnDef<SoldCar>[] = [
	{ accessorKey: "model", header: "Car Model" },
	{ accessorKey: "salePrice", header: "Sale Price" },
	{ accessorKey: "sharer", header: "Sharer" },
	{ accessorKey: "commissionPct", header: "Commission (%)" },
	{ accessorKey: "commission", header: "Commission THB" },
	{ accessorKey: "companyRevenue", header: "Company Revenue" },
	{ accessorKey: "soldDate", header: "Sold Date" },
];

export default function Page() {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="p-6">
			<h1 className="text-xl font-semibold mb-4">All Sold Cars</h1>

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
