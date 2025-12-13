"use client";

import type {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";

interface UseDataTableProps<TData, TValue> {
	data: TData[];
	columns: ColumnDef<TData, TValue>[];
	initialPageSize?: number;
}

export function useDataTable<TData, TValue>({
	initialPageSize = 10,
}: UseDataTableProps<TData, TValue>) {
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: initialPageSize,
	});

	return {
		columnVisibility,
		setColumnVisibility,
		columnFilters,
		setColumnFilters,
		sorting,
		setSorting,
		pagination,
		setPagination,
	};
}
