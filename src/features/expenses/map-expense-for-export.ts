import type { Expense } from "./actions/get-expenses";

export function mapExpenseForExport(expense: Expense) {
	return {
		Date: expense.date
			? new Date(expense.date).toISOString().split("T")[0]
			: "",
		Amount: expense.amount,
		Notes: expense.notes ?? "",
		Category: expense.category?.name ?? "",
		Employee: expense.paidTo?.name ?? "",
		Position: expense.paidTo?.position ?? "",
		Car: expense.car?.name ?? "",
		"Car License": expense.car?.licenseNumber ?? "",
	};
}
