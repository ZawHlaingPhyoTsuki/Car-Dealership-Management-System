import type { Expense } from "./actions/get-expenses";

export function mapExpenseForExport(expense: Expense) {
	return {
		date: expense.date
			? new Date(expense.date).toISOString().split("T")[0]
			: "",
		amount: expense.amount,
		notes: expense.notes ?? "",
		category: expense.category?.name ?? "",
		employee: expense.paidTo?.name ?? "",
		position: expense.paidTo?.position ?? "",
		car: expense.car?.name ?? "",
		carLicense: expense.car?.licenseNumber ?? "",
	};
}
