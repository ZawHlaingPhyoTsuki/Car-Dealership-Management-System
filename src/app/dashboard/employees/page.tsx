import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import ContentWrapper from "@/components/shared/content-wrapper";
import { getEmployees } from "@/features/employees/actions/get-employees";
import AddEmployeeDialog from "@/features/employees/components/add-employee-dialog";
import { EmployeeTable } from "@/features/employees/components/employee-table";

export const metadata: Metadata = {
	title: "Employees",
	description: "Business employees dashboard",
};

export default async function EmployeePage() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["employees"],
		queryFn: getEmployees,
	});

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
