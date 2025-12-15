"use client";

import DataTable from "@/components/shared/data-table";
import { useExpenses } from "../queries/get-expenses";
import { columns } from "./columns";

export function ExpenseTable() {
	const { data: expenses = [], isLoading, error } = useExpenses();

	if (isLoading) return <div>Loading expenses...</div>;
	if (error) return <div>Error loading expenses</div>;

	return <DataTable columns={columns} data={expenses} />;
}
