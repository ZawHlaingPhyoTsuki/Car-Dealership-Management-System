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
	totalProfit: number;
	ownerProfit: number;
	sharerProfit: number;
};

const data: ProfitSummary[] = [
	{
		month: "2025-01",
		carsSold: 7,
		totalProfit: 340000,
		ownerProfit: 220000,
		sharerProfit: 120000,
	},
	{
		month: "2025-02",
		carsSold: 5,
		totalProfit: 280000,
		ownerProfit: 190000,
		sharerProfit: 90000,
	},
	{
		month: "2025-03",
		carsSold: 9,
		totalProfit: 420000,
		ownerProfit: 280000,
		sharerProfit: 140000,
	},
	{
		month: "2025-04",
		carsSold: 6,
		totalProfit: 310000,
		ownerProfit: 210000,
		sharerProfit: 100000,
	},
];

const columns: ColumnDef<ProfitSummary>[] = [
	{
		accessorKey: "month",
		header: "Month",
	},
	{
		accessorKey: "carsSold",
		header: "Cars Sold",
	},
	{
		accessorKey: "totalProfit",
		header: "Total Profit",
		cell: ({ row }) => {
			const profit = row.getValue<number>("totalProfit");
			return `${profit.toLocaleString()} THB`;
		},
	},
	{
		accessorKey: "ownerProfit",
		header: "Owner Profit",
		cell: ({ row }) => {
			const ownerProfit = row.getValue<number>("ownerProfit");
			const totalProfit = row.original.totalProfit;
			const percentage =
				totalProfit > 0 ? (ownerProfit / totalProfit) * 100 : 0;
			return (
				<div className="space-y-1">
					<div className="font-medium">{ownerProfit.toLocaleString()} THB</div>
					<div className="text-sm text-gray-500">
						({percentage.toFixed(1)}%)
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "sharerProfit",
		header: "Sharer Profit",
		cell: ({ row }) => {
			const sharerProfit = row.getValue<number>("sharerProfit");
			const totalProfit = row.original.totalProfit;
			const percentage =
				totalProfit > 0 ? (sharerProfit / totalProfit) * 100 : 0;
			return (
				<div className="space-y-1">
					<div className="font-medium">{sharerProfit.toLocaleString()} THB</div>
					<div className="text-sm text-gray-500">
						({percentage.toFixed(1)}%)
					</div>
				</div>
			);
		},
	},
];

export default function Page() {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	// Calculate totals
	const totals = {
		carsSold: data.reduce((sum, item) => sum + item.carsSold, 0),
		totalProfit: data.reduce((sum, item) => sum + item.totalProfit, 0),
		ownerProfit: data.reduce((sum, item) => sum + item.ownerProfit, 0),
		sharerProfit: data.reduce((sum, item) => sum + item.sharerProfit, 0),
	};

	const totalOwnerPercentage =
		totals.totalProfit > 0
			? (totals.ownerProfit / totals.totalProfit) * 100
			: 0;
	const totalSharerPercentage =
		totals.totalProfit > 0
			? (totals.sharerProfit / totals.totalProfit) * 100
			: 0;

	return (
		<div className="p-6">
			<h1 className="text-xl font-bold mb-4">Monthly Car Profit Summary</h1>
			<p className="text-gray-600 mb-4">
				Overview of monthly car sales and profit distribution
			</p>

			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
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

					{/* Totals Row */}
					<TableRow className="bg-gray-50 dark:bg-gray-800 font-semibold">
						<TableCell>Total</TableCell>
						<TableCell>{totals.carsSold}</TableCell>
						<TableCell className="text-green-600">
							{totals.totalProfit.toLocaleString()} THB
						</TableCell>
						<TableCell>
							<div>{totals.ownerProfit.toLocaleString()} THB</div>
							<div className="text-sm">
								({totalOwnerPercentage.toFixed(1)}%)
							</div>
						</TableCell>
						<TableCell>
							<div>{totals.sharerProfit.toLocaleString()} THB</div>
							<div className="text-sm">
								({totalSharerPercentage.toFixed(1)}%)
							</div>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
				<div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
					<div className="text-sm text-gray-500">Total Months</div>
					<div className="text-2xl font-bold">{data.length}</div>
				</div>
				<div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
					<div className="text-sm text-gray-500">Total Cars Sold</div>
					<div className="text-2xl font-bold">{totals.carsSold}</div>
				</div>
				<div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
					<div className="text-sm text-gray-500">Avg Cars/Month</div>
					<div className="text-2xl font-bold">
						{(totals.carsSold / data.length).toFixed(1)}
					</div>
				</div>
				<div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
					<div className="text-sm text-gray-500">Avg Profit/Car</div>
					<div className="text-2xl font-bold">
						{Math.round(totals.totalProfit / totals.carsSold).toLocaleString()}{" "}
						THB
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
				<div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
					<div className="text-sm text-gray-500">Total Profit</div>
					<div className="text-2xl font-bold text-green-600">
						{totals.totalProfit.toLocaleString()} THB
					</div>
					<div className="text-sm text-gray-500">100%</div>
				</div>
				<div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
					<div className="text-sm text-gray-500">Owner Share</div>
					<div className="text-2xl font-bold">
						{totals.ownerProfit.toLocaleString()} THB
					</div>
					<div className="text-lg font-medium">
						{totalOwnerPercentage.toFixed(1)}%
					</div>
				</div>
				<div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
					<div className="text-sm text-gray-500">Sharer Share</div>
					<div className="text-2xl font-bold">
						{totals.sharerProfit.toLocaleString()} THB
					</div>
					<div className="text-lg font-medium">
						{totalSharerPercentage.toFixed(1)}%
					</div>
				</div>
			</div>

			<p className="text-sm text-gray-500 mt-4">
				Month: The month in which the car was sold.
			</p>
			<p className="text-sm text-gray-500 mt-4">
				Cars Sold: The number of cars sold in the month.
			</p>
			<p className="text-sm text-gray-500 mt-4">
				Total Profit: The total profit made from selling the cars.
			</p>
			<p className="text-sm text-gray-500 mt-4">
				Owner Profit: The profit made by the owner from selling the cars.
			</p>
			<p className="text-sm text-gray-500 mt-4">
				Sharer Profit: The profit made by the sharer from selling the cars.
			</p>
		</div>
	);
}
