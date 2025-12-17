"use client";

import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useCarProfitSummary } from "../queries/use-car-profit";
import { columns } from "./columns";

export default function CarProfitTable() {
	const { data = [], isLoading, error } = useCarProfitSummary();
	const [selectedYear, setSelectedYear] = useState<string>("all");

	// Extract unique years from data
	const years = useMemo(() => {
		const yearSet = new Set<string>();
		data.forEach((item) => {
			const year = new Date(item.month).getFullYear();
			yearSet.add(year.toString());
		});
		return Array.from(yearSet).sort(
			(a, b) => parseInt(b, 10) - parseInt(a, 10),
		);
	}, [data]);

	// Filter data by year
	const filteredData = useMemo(() => {
		if (selectedYear === "all") return data;
		return data.filter((item) => {
			const itemYear = new Date(item.month).getFullYear();
			return itemYear.toString() === selectedYear;
		});
	}, [data, selectedYear]);

	const table = useReactTable({
		data: filteredData,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	// Calculate totals for filtered data
	const totals = filteredData.reduce(
		(acc, item) => {
			acc.carsSold += item.carsSold;
			acc.totalProfit += item.totalProfit;
			return acc;
		},
		{
			carsSold: 0,
			totalProfit: 0,
		},
	);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return (
			<div className="p-6">
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<h3 className="text-red-800 font-semibold">
						Error loading profit summary
					</h3>
					<p className="text-red-600 mt-1">
						Failed to load car profit data. Please try again.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="mb-4 flex items-center justify-between">
				<h3 className="text-lg font-semibold">Monthly Car Profit Summary</h3>
				<Select
					value={selectedYear}
					onValueChange={(value) => setSelectedYear(value)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select Year" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Years</SelectItem>
						{years.map((year) => (
							<SelectItem key={year} value={year}>
								{year}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="overflow-hidden rounded-lg border">
				<Table>
					<TableHeader className="bg-gray-50 dark:bg-gray-800">
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
							<TableRow
								key={row.id}
								className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))}

						{/* Totals Row */}
						{data.length > 0 && (
							<TableRow className="bg-gray-50 dark:bg-gray-800 font-semibold border-t-2">
								<TableCell className="font-bold">Grand Total</TableCell>
								<TableCell className="font-bold text-right">
									{totals.carsSold}
								</TableCell>
								<TableCell className="text-right font-bold text-green-600">
									{totals.totalProfit.toLocaleString()} THB
								</TableCell>
							</TableRow>
						)}

						{data.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center text-gray-500"
								>
									No car sales data available. Start by marking cars as "SOLD"
									in the cars section.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
				<h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
					Note
				</h3>
				<ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
					<li>
						•{" "}
						<strong>
							Total Profit = Sum of all car selling prices in that month
						</strong>
					</li>
					<li>• Only includes cars marked as "SOLD" with a sale date</li>
					<li>• Profit shown is gross revenue from car sales</li>
				</ul>
			</div>
		</div>
	);
}
