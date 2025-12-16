'use client';

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
} from '@tanstack/react-table';
import { Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import PopoverSelect from '@/components/shared/popover-select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useGetCars } from '@/features/cars/queries/use-cars';
import { getPresetRange } from '@/lib/date-presets';
import { useExpenseCategories } from '../queries/get-expense-category';
import { useExpenses } from '../queries/get-expenses';
import { columns } from './columns';

export default function ExpensesTable() {
    const { data = [] } = useExpenses();
    const { data: categories = [] } = useExpenseCategories();
    const { data: cars = [] } = useGetCars();

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([
        {
            id: 'amount',
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

    const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [selectedToday, setSelectedToday] = useState(false);
    const [selectedThisMonth, setSelectedThisMonth] = useState(false);
    const [selectedThisYear, setSelectedThisYear] = useState(false);
    const [selectedFrom, setSelectedFrom] = useState<Date | null>(null);
    const [selectedTo, setSelectedTo] = useState<Date | null>(null);

    const filtersCount = [
        selectedCarId,
        selectedCategoryId,
        selectedToday,
        selectedThisMonth,
        selectedThisYear,
        selectedFrom,
        selectedTo,
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
        setSelectedFrom(null);
        setSelectedTo(null);
        setSelectedToday(false);
        setSelectedThisMonth(false);
        setSelectedThisYear(false);
    }

    return (
        <div className="w-full flex-col justify-start gap-6 mt-6">
            <div className="flex items-center py-4">
                {/* Filter */}
                <div className="w-full space-y-2">
                    <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-3 px-2 py-6">
                        <div className="w-full min-w-[150px]">
                            <PopoverSelect
                                value={selectedCategoryId}
                                onChange={(val) => {
                                    table
                                        .getColumn('category')
                                        ?.setFilterValue(
                                            val === null
                                                ? undefined
                                                : val === 'none'
                                                ? '_NONE_'
                                                : val
                                        );
                                    setSelectedCategoryId(val);
                                }}
                                selector="Reason"
                                items={[{ id: 'none', name: 'Without Reason' }, ...categories]}
                                allowNone
                                matchTriggerWidth
                                getLabel={(cat) => `${cat.name}`}
                                getValue={(cat) => cat.id}
                                customLabel="All"
                                customSubLabel="Show all reasons"
                            />
                        </div>
                        <div className="w-full min-w-[150px]">
                            <PopoverSelect
                                value={selectedCarId}
                                onChange={(val) => {
                                    table
                                        .getColumn('car')
                                        ?.setFilterValue(val === null ? undefined : val);
                                    setSelectedCarId(val);
                                }}
                                selector="Car"
                                items={cars}
                                allowNone
                                matchTriggerWidth
                                getLabel={(car) => `${car.name} (${car.color})`}
                                getValue={(car) => car.id}
                                getSubLabel={(car) => car.licenseNumber ?? 'No Number'}
                                customLabel="All"
                                customSubLabel="Show all cars"
                            />
                        </div>

                        <div className="flex items-center justify-around gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    const range = getPresetRange('today');
                                    table.getColumn('date')?.setFilterValue(range);

                                    setSelectedToday((selected) => !selected);
                                    setSelectedThisMonth(false);
                                    setSelectedThisYear(false);
                                    setSelectedFrom(null);
                                    setSelectedTo(null);
                                }}
                            >
                                {selectedToday && <Check />}
                                Today
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => {
                                    const range = getPresetRange('month');
                                    table.getColumn('date')?.setFilterValue(range);

                                    setSelectedThisMonth((selected) => !selected);
                                    setSelectedToday(false);
                                    setSelectedThisYear(false);
                                    setSelectedFrom(null);
                                    setSelectedTo(null);
                                }}
                            >
                                {selectedThisMonth && <Check />}
                                This Month
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => {
                                    const range = getPresetRange('year');
                                    table.getColumn('date')?.setFilterValue(range);

                                    setSelectedThisYear((selected) => !selected);
                                    setSelectedToday(false);
                                    setSelectedThisMonth(false);
                                    setSelectedFrom(null);
                                    setSelectedTo(null);
                                }}
                            >
                                {selectedThisYear && <Check />}
                                This Year
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            className="ml-auto border-2 border-destructive dark:border-destructive"
                            variant="outline"
                            onClick={() => {
                                // setDateRange({});
                                // table.getColumn("date")?.setFilterValue(undefined);
                                table.resetColumnFilters();
                                resetFilters();
                            }}
                            disabled={filtersCount === 0}
                        >
                            <X />
                            Clear Filters {filtersCount > 0 && `(${filtersCount})`}
                        </Button>
                        <div className="flex items-center gap-1">
                            <Label htmlFor="date-from" className="text-sm text-muted-foreground">
                                From
                            </Label>
                            <input
                                id="date-from"
                                type="date"
                                className="border rounded px-2 py-1 text-sm"
                                value={dateRange.from ?? ''}
                                onChange={(e) => {
                                    const from = e.target.value;
                                    setDateRange((prev) => ({ ...prev, from }));

                                    table.getColumn('date')?.setFilterValue({
                                        from: from ? new Date(from) : undefined,
                                        to: dateRange.to ? new Date(dateRange.to) : undefined,
                                    });
                                }}
                            />
                        </div>

                        <div className="flex items-center gap-1">
                            <Label htmlFor="date-to" className="text-sm text-muted-foreground">
                                To
                            </Label>
                            <input
                                id="date-to"
                                type="date"
                                className="border rounded px-2 py-1 text-sm"
                                value={dateRange.to ?? ''}
                                onChange={(e) => {
                                    const to = e.target.value;
                                    setDateRange((prev) => ({ ...prev, to }));

                                    table.getColumn('date')?.setFilterValue({
                                        from: dateRange.from ? new Date(dateRange.from) : undefined,
                                        to: to ? new Date(to) : undefined,
                                    });
                                }}
                            />
                        </div>
                    </div>
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
                                                      header.getContext()
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
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
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
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
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
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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
