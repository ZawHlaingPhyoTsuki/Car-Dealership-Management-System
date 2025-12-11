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
	car: string;
	buyPrice: string;
	salePrice: string;
	profit: string;
	ownerProfit: string;
	sharerProfit: string;
	soldDate: string;
};

const data: SoldCar[] = [
	{
		car: "Toyota Vigo 2014",
		buyPrice: "430,000 THB",
		salePrice: "580,000 THB",
		profit: "150,000 THB",
		ownerProfit: "105,000 THB",
		sharerProfit: "45,000 THB",
		soldDate: "2025-02-08",
	},
	{
		car: "Honda City 2018",
		buyPrice: "350,000 THB",
		salePrice: "420,000 THB",
		profit: "70,000 THB",
		ownerProfit: "49,000 THB",
		sharerProfit: "21,000 THB",
		soldDate: "2025-02-07",
	},
	{
		car: "Nissan March 2016",
		buyPrice: "240,000 THB",
		salePrice: "290,000 THB",
		profit: "50,000 THB",
		ownerProfit: "35,000 THB",
		sharerProfit: "15,000 THB",
		soldDate: "2025-02-06",
	},
];

const columns: ColumnDef<SoldCar>[] = [
	{ accessorKey: "car", header: "Car" },
	{ accessorKey: "buyPrice", header: "Buy Price" },
	{ accessorKey: "salePrice", header: "Sale Price" },
	{ accessorKey: "profit", header: "Profit" },
	{ accessorKey: "ownerProfit", header: "Owner Profit" },
	{ accessorKey: "sharerProfit", header: "Sharer Profit" },
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
			<h1 className="text-xl font-semibold mb-4">Sold Cars Analytics</h1>

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
