import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import ContentWrapper from "@/components/shared/content-wrapper";
import AddEmployeeDialog from "@/features-v2/employees/components/add-employee-dialog";
import { EmployeeTable } from "@/features-v2/employees/components/employee-table";
import { getEmployeesQueryOptions } from "@/features-v2/employees/queries/use-employees";

export const metadata: Metadata = {
	title: "Employees",
	description: "Business employees dashboard",
};

export default async function EmployeePage() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery(getEmployeesQueryOptions);

	return (
		<ContentWrapper
			title="Employee Management"
			description="Manage your dealership employees and their information"
			addButton={<AddEmployeeDialog />}
		>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<EmployeeTable />
			</HydrationBoundary>
		</ContentWrapper>
	);
}
