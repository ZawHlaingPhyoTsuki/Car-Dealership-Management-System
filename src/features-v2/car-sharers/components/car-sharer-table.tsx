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
import { useState } from "react";
import * as XLSX from "xlsx";
import TableError from "@/components/errors/table-error";
import DataTablePagination from "@/components/shared/data-table-pagination";
import { TableExportButton } from "@/components/shared/export-button";
import TableLoading from "@/components/shared/table-loading";
import { Input } from "@/components/ui/input";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useGetCars } from "@/features-v2/cars/queries/use-cars";
import { columns } from "./columns";

export default function CarSharerTable() {
	const { data = [], isLoading, error, refetch } = useGetCars();

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

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

		const dataToExport = rows.map((row) => {
			return {
				"Car Model": row.original.name,
				"License Number": row.original.licenseNumber,
				"Purchased Price": row.original.purchasedPrice,
				"Selling Price": row.original.sellingPrice,
				"7hr Buy Amount": row.original.companyInvestedAmount,
				"Shareholder Buy Amount": row.original.shareholderInvestedAmount,
				"Profit Amount": row.original.profitAmount,
				"7hr Profit": row.original.companyProfitAmount,
				"Shareholder Profit": row.original.shareholderProfitAmount,

				"Car Status": row.original.status,
				"Car Sold Date": row.original.soldAt
					? new Date(row.original.soldAt).toISOString().split("T")[0]
					: "",
			};
		});

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

		XLSX.utils.book_append_sheet(workbook, worksheet, "Car Sharers");
		worksheet["!cols"] = cols;

		XLSX.writeFile(
			workbook,
			`car-sharers-export-${new Date().toISOString().split("T")[0]}.xlsx`,
		);
	};

	if (isLoading) return <TableLoading label="Getting Car Sharers..." />;
	if (error) return <TableError label={"car sharers"} onRetry={refetch} />;

	return (
		<div className="w-full flex-col justify-start gap-6 mt-6">
			{/* Search and export button */}
			<div className="flex items-center justify-between py-4">
				<div className="flex items-center">
					<Input
						key="name"
						placeholder="Filter by name..."
						value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
						onChange={(event) =>
							table.getColumn("name")?.setFilterValue(event.target.value)
						}
						className="max-w-sm mr-4"
					/>
				</div>

				<TableExportButton variant="outline" onClick={exportToExcel} />
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
