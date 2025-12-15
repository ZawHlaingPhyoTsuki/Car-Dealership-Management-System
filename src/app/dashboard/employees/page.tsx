<<<<<<< HEAD
import { faker } from "@faker-js/faker";
import type { Metadata } from "next";
import type * as z from "zod";
import EmployeeDataTable, {
	type EmployeeSchema,
} from "@/features/employees/components/data-table";
=======
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import ContentWrapper from "@/components/shared/content-wrapper";
import AddEmployeeDialog from "@/features/employees/components/add-employee-dialog";
import { EmployeeTable } from "@/features/employees/components/employee-table";
import { getEmployeesQueryOptions } from "@/features/employees/queries/use-employees";
>>>>>>> dev

export const metadata: Metadata = {
	title: "Employees",
	description: "Business employees dashboard",
};

<<<<<<< HEAD
// Generate realistic employee data with Faker
const generateEmployees = (
	count: number = 40,
): z.infer<typeof EmployeeSchema>[] => {
	const positions = [
		"Sales Manager",
		"Sales Associate",
		"Mechanic",
		"Service Advisor",
		"Finance Manager",
		"Detailer",
		"Receptionist",
		"Lot Porter",
		"Parts Specialist",
		"General Manager",
	];

	return Array.from({ length: count }, (_, _i) => ({
		id: faker.string.uuid(), // UNIQUE UUID for each employee
		name: faker.person.fullName(),
		email: faker.internet.email(),
		position: faker.helpers.arrayElement(positions),
		phone: faker.phone.number(),
		address: faker.location.streetAddress(),
		salary: faker.number.int({ min: 30000, max: 120000 }),
		startDate: faker.date.past({ years: 5 }),
	}));
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
			<EmployeeDataTable data={data} />
		</div>
=======
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
>>>>>>> dev
	);
}
