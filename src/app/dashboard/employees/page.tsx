import type { Metadata } from "next";
import DataTable from "@/components/ui/data-table";
import { columns } from "@/features/employees/components/columns";
import { generateEmployees } from "@/features/employees/data";

export const metadata: Metadata = {
	title: "Employees",
	description: "Business employees dashboard",
};

const data = generateEmployees(45); // Generate 45 employees

export default function EmployeePage() {
	return (
		<div className="p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Employee Management</h1>
				<p className="text-gray-600 mt-2">
					Manage your dealership employees and their information
				</p>
			</div>
			<DataTable columns={columns} data={data} />
		</div>
	);
}
