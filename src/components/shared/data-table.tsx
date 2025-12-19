"use client";

import {
	type ColumnDef,
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
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	LayoutGrid,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
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
import DataTablePagination from "./data-table-pagination";

export interface FilterConfig {
	id: string;
	type: "select" | "text";
	options?: { value: string; label: string }[];
	placeholder?: string;
}

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	filters?: FilterConfig[];
}

export default function DataTable<TData, TValue>({
	columns,
	data,
	filters = [],
}: DataTableProps<TData, TValue>) {
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

	return (
		<div className="w-full flex-col justify-start gap-6 mt-6">
			<div className="flex items-center justify-between py-4">
				{/* Render dynamic filters */}
				<div className="flex items-center">
					{filters.map((filter) => {
						if (filter.type === "text") {
							return (
								<Input
									key={filter.id}
									placeholder={filter.placeholder || `Filter ${filter.id}...`}
									value={
										(table.getColumn(filter.id)?.getFilterValue() as string) ??
										""
									}
									onChange={(event) =>
										table
											.getColumn(filter.id)
											?.setFilterValue(event.target.value)
									}
									className="max-w-sm mr-4"
								/>
							);
						}

						if (filter.type === "select" && filter.options) {
							const currentValue =
								(table.getColumn(filter.id)?.getFilterValue() as string) ?? "";

							return (
								<Select
									key={filter.id}
									value={currentValue}
									onValueChange={(value) => {
										table
											.getColumn(filter.id)
											?.setFilterValue(value === "all" ? "" : value);
									}}
								>
									<SelectTrigger className="w-[180px] mr-4">
										<SelectValue
											placeholder={
												filter.placeholder || `Filter by ${filter.id}`
											}
										/>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All</SelectItem>
										{filter.options.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							);
						}

						return null;
					})}
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
