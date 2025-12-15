"use client";

import DataTable from "@/components/shared/data-table";
import LoadingTable from "@/components/shared/loading-table";
import { columns } from "@/features/employees/components/columns";
import { useEmployees } from "@/features/employees/queries/use-employees";

export function EmployeeTable() {
	const { data: employees = [], isLoading, error } = useEmployees();

	if (isLoading) return <LoadingTable label="Getting Employees..." />;
	if (error) return <div>Error loading employees</div>;

	return <DataTable columns={columns} data={employees} />;
}
