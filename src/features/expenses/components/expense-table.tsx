"use client";

import {
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
} from "@tabler/icons-react";
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
	type VisibilityState,
} from "@tanstack/react-table";
import { X } from "lucide-react";
import { useState } from "react";
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
import { getPresetRange } from "@/lib/date-presets";
import { useExpenseCategories } from "../queries/get-expense-category";
import { useExpenses } from "../queries/get-expenses";
import { columns } from "./columns";
import { useGetCars } from "@/features/cars/queries/use-cars";

export default function ExpensesTable() {
	const { data = [] } = useExpenses();
	const { data: categories = [] } = useExpenseCategories();
	const { data: cars = [] } = useGetCars();

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([
		{
			id: "amount",
			desc: false,
		},
	]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [dateRange, setDateRange] = useState<{
		from?: string;
		to?: string;
	}>({});

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			columnFilters,
			pagination,
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		onColumnFiltersChange: setColumnFilters,
		onPaginationChange: setPagination,
	});

	// Calculate showing text correctly
	const totalRows = table.getFilteredRowModel().rows.length;
	const currentPageIndex = table.getState().pagination.pageIndex;
	const pageSize = table.getState().pagination.pageSize;
	const startRow = currentPageIndex * pageSize + 1;
	const endRow = Math.min((currentPageIndex + 1) * pageSize, totalRows);

	return (
		<div className="w-full flex-col justify-start gap-6 mt-6">
			<div className="flex items-center py-4">
				{/* Filter here */}
				<div className="flex flex-wrap gap-3 px-2 py-6">
					<Select
						onValueChange={(value) => {
							table
								.getColumn("category")
								?.setFilterValue(value === "all" ? undefined : value);
						}}
					>
						<SelectTrigger className="w-40">
							<SelectValue placeholder="Category" />
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="all">All Reason</SelectItem>
							{categories.map((cat) => (
								<SelectItem key={cat.id} value={cat.id}>
									{cat.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						onValueChange={(value) => {
							table
								.getColumn("car")
								?.setFilterValue(value === "all" ? undefined : value);
						}}
					>
						<SelectTrigger className="w-40">
							<SelectValue placeholder="Car" />
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="all">All Cars</SelectItem>
							{cars.map((car) => (
								<SelectItem key={car.id} value={car.id}>
									{car.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<div className="flex gap-2 flex-wrap">
						<Button
							variant="outline"
							onClick={() => {
								const range = getPresetRange("today");
								table.getColumn("date")?.setFilterValue(range);
							}}
						>
							Today
						</Button>

						<Button
							variant="outline"
							onClick={() => {
								const range = getPresetRange("month");
								table.getColumn("date")?.setFilterValue(range);
							}}
						>
							This Month
						</Button>

						<Button
							variant="outline"
							onClick={() => {
								const range = getPresetRange("year");
								table.getColumn("date")?.setFilterValue(range);
							}}
						>
							This Year
						</Button>
					</div>
					<div className="flex gap-2">
						<div className="flex flex-col gap-1">
							<Label htmlFor="date-from" className="text-sm">
								From
							</Label>
							<input
								id="date-from"
								type="date"
								className="border rounded px-2 py-1 text-sm"
								value={dateRange.from ?? ""}
								onChange={(e) => {
									const from = e.target.value;
									setDateRange((prev) => ({ ...prev, from }));

									table.getColumn("date")?.setFilterValue({
										from: from ? new Date(from) : undefined,
										to: dateRange.to ? new Date(dateRange.to) : undefined,
									});
								}}
							/>
						</div>

						<div className="flex flex-col gap-1">
							<Label htmlFor="date-to" className="text-sm">
								To
							</Label>
							<input
								id="date-to"
								type="date"
								className="border rounded px-2 py-1 text-sm"
								value={dateRange.to ?? ""}
								onChange={(e) => {
									const to = e.target.value;
									setDateRange((prev) => ({ ...prev, to }));

									table.getColumn("date")?.setFilterValue({
										from: dateRange.from ? new Date(dateRange.from) : undefined,
										to: to ? new Date(to) : undefined,
									});
								}}
							/>
						</div>
					</div>
				</div>
				<Button
					variant="outline"
					onClick={() => {
						// setDateRange({});
						// table.getColumn("date")?.setFilterValue(undefined);
						table.resetColumnFilters();
					}}
				>
					<X />
					Clear Filters
				</Button>
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
							<IconChevronsLeft />
						</Button>
						<Button
							variant="outline"
							className="size-8"
							size="icon"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to previous page</span>
							<IconChevronLeft />
						</Button>
						<Button
							variant="outline"
							className="size-8"
							size="icon"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to next page</span>
							<IconChevronRight />
						</Button>
						<Button
							variant="outline"
							className="hidden size-8 lg:flex"
							size="icon"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to last page</span>
							<IconChevronsRight />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
