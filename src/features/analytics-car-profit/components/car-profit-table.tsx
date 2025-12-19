"use client";

import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { TableExportButton } from "@/components/shared/export-button";
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
			const year = item.month.split(" ")[0]; // Extract year from "yyyy MMMM"
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
			const itemYear = item.month.split(" ")[0];
			return itemYear === selectedYear;
		});
	}, [data, selectedYear]);

	const table = useReactTable({
		data: filteredData,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	// Calculate totals for filtered data
	const totals = useMemo(
		() =>
			filteredData.reduce(
				(acc, item) => {
					acc.carsSold += item.carsSold;
					acc.totalProfit += item.totalProfit;
					return acc;
				},
				{
					carsSold: 0,
					totalProfit: 0,
				},
			),
		[filteredData],
	);

	const exportToExcel = () => {
		const selectedRows = table.getSelectedRowModel().rows;

		const rows =
			selectedRows.length > 0 ? selectedRows : table.getFilteredRowModel().rows;

		if (rows.length === 0) return;

		const dataToExport = rows.map((row) => ({
			month: row.original.month,
			carsSold: row.original.carsSold,
			totalProfit: row.original.totalProfit,
		}));

		// Calculate totals from the rows being exported
		const exportTotals = rows.reduce(
			(acc, row) => {
				acc.carsSold += row.original.carsSold;
				acc.totalProfit += row.original.totalProfit;
				return acc;
			},
			{ carsSold: 0, totalProfit: 0 },
		);

		// Append TOTAL row
		dataToExport.push({
			month: "Grand Total",
			carsSold: exportTotals.carsSold,
			totalProfit: exportTotals.totalProfit,
		});

		// Create worksheet
		const worksheet = XLSX.utils.json_to_sheet(dataToExport);

		// Auto-size columns
		const headers = Object.keys(dataToExport[0]);

		const colWidths = headers.map((header) => {
			const maxLength = Math.max(
				header.length,
				...dataToExport.map(
					(row) => String(row[header as keyof typeof row] ?? "").length,
				),
			);

			return { wch: maxLength + 2 }; // +2 padding
		});

		worksheet["!cols"] = colWidths;

		// Create workbook
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Car Profit");

		// Export
		XLSX.writeFile(
			workbook,
			`car-profit-${new Date().toISOString().split("T")[0]}.xlsx`,
		);
	};

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
			<div className="mb-4 flex items-center justify-end gap-2">
				{/* Year Selector */}
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

				{/* Export Button */}
				{/* <Button variant="outline" onClick={exportToExcel}>
					<DownloadIcon className="mr-2" />
					Export as Excel
				</Button> */}
				<TableExportButton variant="outline" onClick={exportToExcel} />
			</div>
			<div className="overflow-hidden rounded-lg border">
				<Table>
					<TableHeader className="bg-muted sticky top-0 z-10">
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
						{filteredData.length > 0 && (
							<TableRow className="bg-gray-50 dark:bg-gray-800 font-semibold border-t-2">
								<TableCell className="font-bold text-lg">Grand Total</TableCell>

								<TableCell className="font-bold text-right text-lg">
									{totals.carsSold}
								</TableCell>

								<TableCell className="text-right font-bold text-green-600 text-lg">
									{totals.totalProfit.toLocaleString()} THB
								</TableCell>
							</TableRow>
						)}

						{filteredData.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center text-gray-500"
								>
									{data.length === 0
										? 'No car sales data available. Start by marking cars as "SOLD" in the cars section.'
										: `No car sales data for ${selectedYear === "all" ? "the selected period" : selectedYear}.`}
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
