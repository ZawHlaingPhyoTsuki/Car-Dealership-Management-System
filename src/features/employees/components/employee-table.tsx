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
import { columns } from "@/features/employees/components/columns";
import { useEmployees } from "@/features/employees/queries/use-employees";

export function EmployeeTable() {
	const { data = [], isLoading, error, refetch } = useEmployees();

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
				"Employee Name": row.original.name,
				Position: row.original.position,
				Percentage: row.original.percentage,
				Salary: row.original.salary,
				"Start Date": row.original.startDate,
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

		XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
		worksheet["!cols"] = cols;

		XLSX.writeFile(
			workbook,
			`employees-export-${new Date().toISOString().split("T")[0]}.xlsx`,
		);
	};

	if (isLoading) return <TableLoading label="Getting Employees..." />;
	if (error) return <TableError label={"employees"} onRetry={refetch} />;

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
