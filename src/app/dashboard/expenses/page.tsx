import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import ContentWrapper from "@/components/shared/content-wrapper";
import { getEmployeesQueryOptions } from "@/features-v2/employees/queries/use-employees";
import AddExpenseCategoryDialog from "@/features-v2/expenses/components/add-expense-category-dialog";
import AddExpenseDialog from "@/features-v2/expenses/components/add-expense-dialog";
import ExpensesTable from "@/features-v2/expenses/components/expense-table";
import { getExpenseCategoriesQueryOptions } from "@/features-v2/expenses/queries/get-expense-category";
import { getExpensesQueryOptions } from "@/features-v2/expenses/queries/get-expenses";

export const metadata: Metadata = {
	title: "Expenses",
	description: "Business Expenses dashboard",
};

export default async function Page() {
	const queryClient = new QueryClient();

	await Promise.all([
		queryClient.prefetchQuery(getExpensesQueryOptions),
		queryClient.prefetchQuery(getEmployeesQueryOptions),
		queryClient.prefetchQuery(getExpenseCategoriesQueryOptions),
	]);

	return (
		<ContentWrapper
			title="Expense Management"
			description="Manage your expenses on cars and employees"
			addButton={
				<div className="flex flex-col md:flex-row justify-end gap-2">
					<AddExpenseCategoryDialog />
					<AddExpenseDialog />
				</div>
			}
		>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<ExpensesTable />
			</HydrationBoundary>
		</ContentWrapper>
	);
}
