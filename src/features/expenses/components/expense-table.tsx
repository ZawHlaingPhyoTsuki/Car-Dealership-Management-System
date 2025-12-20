"use client";

import {
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type PaginationState,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { X } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import * as XLSX from "xlsx";
import TableError from "@/components/errors/table-error";
import DataTablePagination from "@/components/shared/data-table-pagination";
import { DateRangePopover } from "@/components/shared/date-range-popover";
import { TableExportButton } from "@/components/shared/export-button";
import PopoverSelect from "@/components/shared/popover-select";
import TableLoading from "@/components/shared/table-loading";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useGetCars } from "@/features/cars/queries/use-cars";
import { mapExpenseForExport } from "../map-expense-for-export";
import { useExpenseCategories } from "../queries/get-expense-category";
import { useExpenses } from "../queries/get-expenses";
import { columns, NO_CATEGORY_FILTER } from "./columns";

export default function ExpensesTable() {
	const { data = [], isLoading, error, refetch } = useExpenses();
	const { data: categories = [] } = useExpenseCategories();
	const { data: cars = [] } = useGetCars();

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null,
	);
	const [dateRange, setDateRange] = useState<DateRange | undefined>();

	const hasDateRange = Boolean(dateRange?.from || dateRange?.to);

	const filtersCount = [selectedCarId, selectedCategoryId, hasDateRange].filter(
		Boolean,
	).length;

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnFilters,
			pagination,
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onPaginationChange: setPagination,
	});

	const exportToExcel = () => {
		const selectedRows = table.getSelectedRowModel().rows;

		const rows =
			selectedRows.length > 0 ? selectedRows : table.getFilteredRowModel().rows;

		const dataToExport = rows.map((row) => mapExpenseForExport(row.original));

		if (dataToExport.length === 0) return;

		// Formatting
		const keys = Object.keys(
			dataToExport[0],
		) as (keyof (typeof dataToExport)[0])[];

		const cols = keys.map((key) => ({
			wch:
				Math.max(
					String(key).length,
					...dataToExport.map((row) => String(row[key] ?? "").length),
				) + 2,
		}));

		const worksheet = XLSX.utils.json_to_sheet(dataToExport);
		const workbook = XLSX.utils.book_new();

		XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
		worksheet["!cols"] = cols;

		XLSX.writeFile(
			workbook,
			`expenses-export-${new Date().toISOString().split("T")[0]}.xlsx`,
		);
	};

	function resetFilters() {
		setSelectedCarId(null);
		setSelectedCategoryId(null);
		setDateRange(undefined);
	}

	if (isLoading) return <TableLoading label="Getting Expenses..." />;
	if (error) return <TableError label={"expenses"} onRetry={refetch} />;

	const handleDateChange = (range?: DateRange) => {
		setDateRange(range);

		table
			.getColumn("date")
			?.setFilterValue(range ? { from: range.from, to: range.to } : undefined);
	};

	return (
		<div className="w-full flex-col justify-start gap-6 mt-6">
			<div className="flex items-center py-4">
				{/* Filter */}
				<div className="w-full flex items-end justify-between flex-wrap gap-3">
					<div className="flex items-center gap-3">
						{/* Date Range */}
						<DateRangePopover value={dateRange} onChange={handleDateChange} />

						{/* Reason Select */}
						<div className="w-[150px] md:w-[200px]">
							<PopoverSelect
								value={selectedCategoryId}
								onChange={(val) => {
									table
										.getColumn("category")
										?.setFilterValue(
											val === null
												? undefined
												: val === "none"
													? NO_CATEGORY_FILTER
													: val,
										);
									setSelectedCategoryId(val);
								}}
								selector="Reason"
								items={[{ id: "none", name: "Without Reason" }, ...categories]}
								allowNone
								matchTriggerWidth
								getLabel={(cat) => `${cat.name}`}
								getValue={(cat) => cat.id}
								customLabel="All"
								customSubLabel="Show all reasons"
							/>
						</div>

						{/* Car Select */}
						<div className="w-[150px] md:w-[200px]">
							<PopoverSelect
								value={selectedCarId}
								onChange={(val) => {
									table
										.getColumn("car")
										?.setFilterValue(val === null ? undefined : val);
									setSelectedCarId(val);
								}}
								selector="Car"
								items={cars}
								allowNone
								matchTriggerWidth
								getLabel={(car) =>
									`${car.name} ${car.licenseNumber ? `(${car.licenseNumber})` : ""}`
								}
								getValue={(car) => car.id}
								getSubLabel={(car) => car.licenseNumber ?? "No Number"}
								customLabel="All"
								customSubLabel="Show all cars"
							/>
						</div>

						{/* Clear Filters Button */}
						<Button
							variant="ghost"
							onClick={() => {
								table.resetColumnFilters();
								resetFilters();
							}}
							disabled={filtersCount === 0}
						>
							<span className="hidden md:block">
								Reset {filtersCount > 0 && `(${filtersCount})`}
							</span>
							<X />
						</Button>
					</div>

					{/* Export Button */}
					<TableExportButton variant="outline" onClick={exportToExcel} />
				</div>
			</div>

			{/* Table */}
			<div className="overflow-hidden rounded-lg border">
				<Table>
					<TableHeader className="bg-muted sticky top-0 z-10">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
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
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<DataTablePagination
				totalRows={table.getFilteredRowModel().rows.length}
				pageSize={table.getState().pagination.pageSize}
				onPageSizeChange={(pageSize) => table.setPageSize(pageSize)}
				currentPageIndex={table.getState().pagination.pageIndex}
				pageCount={table.getPageCount()}
				firstPageButtonOnClick={() => table.setPageIndex(0)}
				firstPageDisabled={!table.getCanPreviousPage()}
				nextPageButtonOnClick={() => table.nextPage()}
				nextPageDisabled={!table.getCanNextPage()}
				previousPageButtonOnClick={() => table.previousPage()}
				previousPageDisabled={!table.getCanPreviousPage()}
				lastPageButtonOnClick={() =>
					table.setPageIndex(table.getPageCount() - 1)
				}
				lastPageDisabled={!table.getCanNextPage()}
			/>
		</div>
	);
}
