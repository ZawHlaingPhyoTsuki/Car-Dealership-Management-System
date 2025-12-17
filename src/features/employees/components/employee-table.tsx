"use client";

import TableError from "@/components/errors/table-error";
import DataTable from "@/components/shared/data-table";
import TableLoading from "@/components/shared/table-loading";
import { columns } from "@/features/employees/components/columns";
import { useEmployees } from "@/features/employees/queries/use-employees";

export function EmployeeTable() {
	const { data: employees = [], isLoading, error, refetch } = useEmployees();

	if (isLoading) return <TableLoading label="Getting Employees..." />;
	if (error) return <TableError label={"employees"} onRetry={refetch} />;

	return <DataTable columns={columns} data={employees} />;
}
