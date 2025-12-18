"use client";

import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	type PaginationState,
	useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
	BanknoteArrowDown,
	Car,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	DownloadIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { getMonthName, getYearName } from "@/lib/utils";
import { useCarsSold } from "../queries/use-car-sold";
import SoldAnalyticsCard from "./car-sold-cards";
import { columns } from "./columns";
import { MonthYearSelector } from "./month-year-selector";

export type Duration = {
	month: number;
	year: number;
};

export default function CarSoldTable() {
	const { data = [], isLoading, error } = useCarsSold();

	const [selectedDuration, setSelectedDuration] = useState<Duration>({
		month: new Date().getMonth(),
		year: new Date().getFullYear(),
	});
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	const table = useReactTable({
		data,
		columns,
		state: { pagination },
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: setPagination,
	});

	// Calculate showing text correctly
	const totalRows = table.getFilteredRowModel().rows.length;
	const currentPageIndex = table.getState().pagination.pageIndex;
	const pageSize = table.getState().pagination.pageSize;
	const startRow = currentPageIndex * pageSize + 1;
	const endRow = Math.min((currentPageIndex + 1) * pageSize, totalRows);

	const handleDurationChange = (duration: Duration) => {
		setSelectedDuration(duration);
	};

	// biome-ignore lint: false positive
	const totals = useMemo(() => {
		const filteredData = table
			.getFilteredRowModel()
			.rows.map((row) => row.original);

		// Calculate month values
		const monthTotals = filteredData.reduce(
			(acc, car) => ({
				monthCars: acc.monthCars + 1,
				monthRevenue: acc.monthRevenue + car.companyRevenue,
			}),
			{ monthCars: 0, monthRevenue: 0 },
		);

		// Calculate year revenue (all data for the selected year)
		const yearRevenue = data.reduce((total, car) => {
			const carDate = new Date(car.soldDate);
			const carYear = carDate.getFullYear();

			// Only include cars from the selected year
			if (carYear === selectedDuration.year) {
				return total + car.companyRevenue;
			}
			return total;
		}, 0);

		return {
			monthCars: monthTotals.monthCars,
			monthRevenue: monthTotals.monthRevenue,
			yearRevenue: yearRevenue,
		};
	}, [data, selectedDuration.year, selectedDuration.month]);

	useEffect(() => {
		if (data.length > 0) {
			table.getColumn("soldDate")?.setFilterValue(selectedDuration);
		}
	}, [data, table, selectedDuration]);

	const exportToExcel = () => {
		const selectedRows = table.getSelectedRowModel().rows;

		const rows =
			selectedRows.length > 0 ? selectedRows : table.getFilteredRowModel().rows;

		if (rows.length === 0) {
			alert("No data to export");
			return;
		}

		const dataToExport = rows.map((row) => ({
			"Car Name": row.original.name,
			"Sale Price (MMK)": row.original.salePrice,
			Sharer: row.original.sharer,
			"Commission (%)": `${row.original.commissionPct}%`,
			"Commission (MMK)": row.original.commission,
			"Company Revenue (MMK)": row.original.companyRevenue,
			"Sold Date": format(new Date(row.original.soldDate), "dd/MM/yyyy"),
			Month: format(new Date(row.original.soldDate), "MMMM"),
			Year: format(new Date(row.original.soldDate), "yyyy"),
		}));

		// Calculate comprehensive totals
		// const exportTotals = rows.reduce(
		// 	(acc, row) => {
		// 		acc.totalSales += row.original.salePrice;
		// 		acc.totalCommission += row.original.commission;
		// 		acc.totalRevenue += row.original.companyRevenue;
		// 		acc.carsCount += 1;
		// 		return acc;
		// 	},
		// 	{ totalSales: 0, totalCommission: 0, totalRevenue: 0, carsCount: 0 },
		// );

		// Create worksheet
		const worksheet = XLSX.utils.json_to_sheet(dataToExport);

		// Auto-size columns
		const headers = Object.keys(dataToExport[0]);
		const colWidths = headers.map((header) => {
			const maxLength = Math.max(
				header.length,
				...dataToExport.map((row) => {
					const value = row[header as keyof typeof row];
					return value ? String(value).length : 0;
				}),
			);
			return { wch: Math.min(maxLength + 2, 50) }; // Max width 50
		});
		worksheet["!cols"] = colWidths;

		// Create workbook
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Sold Cars Report");

		// Add metadata
		const monthName = new Date().toLocaleString("default", { month: "long" });
		const fileName = `sold-cars-report-${monthName}-${new Date().getFullYear()}.xlsx`;

		// Export
		XLSX.writeFile(workbook, fileName);
	};

	if (isLoading) return <div>Loading...</div>;
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
		<div className="space-y-4">
			<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
				<SoldAnalyticsCard
					label={"Sold Cars"}
					amount={totals.monthCars}
					period={"month"}
					numPeriod={selectedDuration.month}
					icon={Car}
				/>
				<SoldAnalyticsCard
					label={"Total Profit"}
					amount={totals.monthRevenue}
					suffix="lakhs"
					period={"month"}
					numPeriod={selectedDuration.month}
					icon={BanknoteArrowDown}
				/>
				<SoldAnalyticsCard
					label={"Total Profit"}
					amount={totals.yearRevenue}
					suffix="lakhs"
					period={"year"}
					numPeriod={selectedDuration.year}
					icon={BanknoteArrowDown}
				/>
			</div>

			<div className="space-y-2">
				<div className="flex items-center justify-end gap-2">
					{/* Month and Year Selector */}
					<MonthYearSelector
						value={selectedDuration}
						onChange={(val) => handleDurationChange(val)}
					/>

					{/* Export Button */}
					<Button variant="outline" onClick={exportToExcel}>
						<DownloadIcon className="mr-2" />
						Export as Excel
					</Button>
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
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center text-muted-foreground"
									>
										{data.length === 0
											? 'No car sales data available. Start by marking cars as "SOLD" in the cars section.'
											: `No car sales data for ${getMonthName(selectedDuration.month)}, ${getYearName(selectedDuration.year)}.`}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
			{/* Pagination */}
			<div className="flex items-center justify-between mt-4">
				{/* Left */}
				<div className="text-sm text-gray-500 whitespace-nowrap">
					Showing {startRow} to {endRow} of {totalRows} entries
				</div>

				{/* Right */}
				<div className="flex w-full items-center gap-8 lg:w-fit">
					{/* Rows per page */}
					<div className="hidden items-center gap-2 lg:flex">
						<Label htmlFor="rows-per-page" className="text-sm font-medium">
							Rows per page
						</Label>
						<Select
							value={`${table.getState().pagination.pageSize}`}
							onValueChange={(value) => {
								table.setPageSize(Number(value));
							}}
						>
							<SelectTrigger size="sm" className="w-20" id="rows-per-page">
								<SelectValue
									placeholder={table.getState().pagination.pageSize}
								/>
							</SelectTrigger>
							<SelectContent side="top">
								{[10, 20, 30, 40, 50].map((pageSize) => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Page number */}
					<div className="ml-auto flex w-fit items-center justify-center text-sm font-medium">
						Page {table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</div>

					{/* Page navigation */}
					<div className="flex items-center gap-2 lg:ml-0">
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to first page</span>
							<ChevronsLeft />
						</Button>
						<Button
							variant="outline"
							className="size-8"
							size="icon"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to previous page</span>
							<ChevronLeft />
						</Button>
						<Button
							variant="outline"
							className="size-8"
							size="icon"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to next page</span>
							<ChevronRight />
						</Button>
						<Button
							variant="outline"
							className="hidden size-8 lg:flex"
							size="icon"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to last page</span>
							<ChevronsRight />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
