import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import ContentWrapper from "@/components/shared/content-wrapper";
import AddExpenseDialog from "@/features/expenses/components/add-expense-dialog";
import { ExpenseTable } from "@/features/expenses/components/expense-table";
import { getExpensesQueryOptions } from "@/features/expenses/queries/get-expenses";
import { getEmployeesQueryOptions } from "@/features/employees/queries/use-employees";

export const metadata: Metadata = {
	title: "Expenses",
	description: "Business Expenses dashboard",
};

export default async function Page() {
	const queryClient = new QueryClient();

	await Promise.all([
		queryClient.prefetchQuery(getExpensesQueryOptions),
		queryClient.prefetchQuery(getEmployeesQueryOptions),
	]);

	return (
		<ContentWrapper
			title="Expense Management"
			description="Manage your expenses on cars and employees"
			addButton={<AddExpenseDialog />}
		>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<ExpenseTable />
			</HydrationBoundary>
		</ContentWrapper>
	);
}
