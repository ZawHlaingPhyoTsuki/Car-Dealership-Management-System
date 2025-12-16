import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import ContentWrapper from "@/components/shared/content-wrapper";
import { getEmployeesQueryOptions } from "@/features/employees/queries/use-employees";
import AddExpenseCategoryDialog from "@/features/expenses/components/add-expense-category-dialog";
import AddExpenseDialog from "@/features/expenses/components/add-expense-dialog";
import { ExpenseTable } from "@/features/expenses/components/expense-table";
import { getExpenseCategoriesQueryOptions } from "@/features/expenses/queries/get-expense-category";
import { getExpensesQueryOptions } from "@/features/expenses/queries/get-expenses";

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
				<div className="flex justify-end gap-2">
					<AddExpenseCategoryDialog />
					<AddExpenseDialog />
				</div>
			}
		>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<ExpenseTable />
			</HydrationBoundary>
		</ContentWrapper>
	);
}
