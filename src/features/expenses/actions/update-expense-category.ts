"use server";

import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import {
	UpdateExpenseCategorySchema,
	type UpdateExpenseCategoryValues,
} from "../validation";

export const updateExpenseCategory = async (
	data: UpdateExpenseCategoryValues,
) => {
	await requireAuth();

	try {
		const { id, name } = UpdateExpenseCategorySchema.parse(data);
		return await prisma.expenseCategory.update({
			where: {
				id,
			},
			data: {
				name,
			},
		});
	} catch (error) {
		console.error("Failed to update expense category: ", error);
		throw new Error("Failed to update expense category");
	}
};
