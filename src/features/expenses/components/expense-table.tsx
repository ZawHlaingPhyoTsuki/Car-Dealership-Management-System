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
	type VisibilityState,
} from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	X,
} from "lucide-react";
import { useState } from "react";
import PopoverSelect from "@/components/shared/popover-select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
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
import { useGetCars } from "@/features/cars/queries/use-cars";
import { getPresetRange } from "@/lib/date-presets";
import { useExpenseCategories } from "../queries/get-expense-category";
import { useExpenses } from "../queries/get-expenses";
import { columns, NO_CATEGORY_FILTER } from "./columns";

type Period = "today" | "month" | "year" | null;

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

	const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null,
	);
	const [selectedPeriod, setSelectedPeriod] = useState<Period>(null);
	const [dateRange, setDateRange] = useState<{
		from?: string;
		to?: string;
	}>({});

	const hasDateRange = Boolean(dateRange.from || dateRange.to);

	const filtersCount = [
		selectedCarId,
		selectedCategoryId,
		selectedPeriod || hasDateRange
	].filter(Boolean).length;

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

	function resetFilters() {
		setSelectedCarId(null);
		setSelectedCategoryId(null);
		setSelectedPeriod(null);
		setDateRange({});
	}

	return (
		<div className="w-full flex-col justify-start gap-6 mt-6">
			<div className="flex items-center py-4">
				{/* Filter */}
				<div className="w-full flex items-end justify-between flex-wrap gap-3 py-6">
					<div className="w-[200px]">
						<PopoverSelect
							value={selectedCategoryId}
							onChange={(val) => {
								table
									.getColumn("category")
									?.setFilterValue(
										val === null ? undefined : val === "none" ? NO_CATEGORY_FILTER : val,
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
					<div className="w-[200px]">
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
							getLabel={(car) => `${car.name} (${car.color})`}
							getValue={(car) => car.id}
							getSubLabel={(car) => car.licenseNumber ?? "No Number"}
							customLabel="All"
							customSubLabel="Show all cars"
						/>
					</div>
					<Select
						key={selectedPeriod ?? "empty"}
						value={selectedPeriod ?? undefined}
						onValueChange={(period) => {
							const p = period as "today" | "month" | "year";
							setSelectedPeriod(p);
							setDateRange({});

							const range = getPresetRange(p);
							table.getColumn("date")?.setFilterValue(range);
						}}
					>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder="Select Period" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="today">Today</SelectItem>
								<SelectItem value="month">This Month</SelectItem>
								<SelectItem value="year">This Year</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<div className="space-y-1">
						<Label
							htmlFor="date-from"
							className="text-sm text-muted-foreground"
						>
							From
						</Label>
						<input
							id="date-from"
							type="date"
							className="border rounded px-2 py-1 text-sm"
							value={dateRange.from ?? ""}
							onChange={(e) => {
								const from = e.target.value;
								setDateRange((prev) => {
									const newRange = { ...prev, from };

									table.getColumn("date")?.setFilterValue({
										from: from ? new Date(from) : undefined,
										to: prev.to ? new Date(prev.to) : undefined,
									});
									return newRange;
								});
							}}
						/>
					</div>

					<div className="space-y-1">
						<Label htmlFor="date-to" className="text-sm text-muted-foreground">
							To
						</Label>
						<input
							id="date-to"
							type="date"
							className="border rounded px-2 py-1 text-sm"
							value={dateRange.to ?? ""}
							onChange={(e) => {
								const to = e.target.value;
								setDateRange((prev) => {
									const newRange = { ...prev, to };

									table.getColumn("date")?.setFilterValue({
										from: prev.from ? new Date(prev.from) : undefined,
										to: to ? new Date(to) : undefined,
									});
									return newRange;
								});
							}}
						/>
					</div>
					<Button
						className="border-2 border-destructive dark:border-destructive"
						variant="outline"
						onClick={() => {
							table.resetColumnFilters();
							resetFilters();
						}}
						disabled={filtersCount === 0}
					>
						<X />
						Clear Filters {filtersCount > 0 && `(${filtersCount})`}
					</Button>
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
