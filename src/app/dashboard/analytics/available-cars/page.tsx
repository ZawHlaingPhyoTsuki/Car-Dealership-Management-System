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

type AvailableCar = {
	car: string;
	buyPrice: string;
	daysInInventory: number;
	addedAt: string;
	sellingPrice: string;
};

const data: AvailableCar[] = [
	{
		car: "Toyota Yaris 2017",
		buyPrice: "280,000 THB",
		daysInInventory: 32,
		addedAt: "2025-01-05",
		sellingPrice: "300,000 THB",
	},
	{
		car: "Mazda 2 2015",
		buyPrice: "260,000 THB",
		daysInInventory: 18,
		addedAt: "2025-01-19",
		sellingPrice: "290,000 THB",
	},
];

const columns: ColumnDef<AvailableCar>[] = [
	{ accessorKey: "car", header: "Car" },
	{ accessorKey: "buyPrice", header: "Buy Price" },
	{ accessorKey: "daysInInventory", header: "Days in Inventory" },
	{ accessorKey: "addedAt", header: "Added Date" },
	{ accessorKey: "sellingPrice", header: "Selling Price" },
];

export default function Page() {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="p-6">
			<h1 className="text-xl font-semibold mb-4">Available Cars Analytics</h1>

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
			<p className="text-gray-600 mt-4">Car: The name of the car.</p>
			<p className="text-gray-600 mt-4">
				Buy Price: The price at which the car was purchased.
			</p>
			<p className="text-gray-600 mt-4">
				Days in Inventory: The number of days the car has been in the inventory.
			</p>
			<p className="text-gray-600 mt-4">
				Added Date: The date the car was added to the inventory.
			</p>
			<p className="text-gray-600 mt-4">
				Selling Price: The estimated selling price of the car.
			</p>
		</div>
	);
}
