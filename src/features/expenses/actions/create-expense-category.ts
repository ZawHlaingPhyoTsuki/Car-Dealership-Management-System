"use server";

import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import {
	CreateExpenseCategorySchema,
	type CreateExpenseCategoryValues,
} from "../validation";

export const createExpenseCategory = async (
	data: CreateExpenseCategoryValues,
) => {
	await requireAuth();

	try {
		const { name } = CreateExpenseCategorySchema.parse(data);
		return await prisma.expenseCategory.create({
			data: {
				name,
			},
		});
	} catch (error) {
		console.error("Failed to create expense category: ", error);
		throw new Error("Failed to create expense category");
	}
};
