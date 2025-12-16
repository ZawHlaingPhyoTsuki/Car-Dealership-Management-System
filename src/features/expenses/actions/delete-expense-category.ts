"use server";

import * as z from "zod";
import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";

export const deleteExpenseCategory = async (id: string) => {
	await requireAuth();

	try {
		if (!id || z.uuid().safeParse(id).success === false) {
			throw new Error("Invalid expense category ID.");
		}

		const expenseCategory = await prisma.expenseCategory.findUnique({
			where: {
				id,
			},
		});
		if (!expenseCategory) {
			throw new Error("Expense category not found");
		}

		return await prisma.expenseCategory.delete({
			where: {
				id,
			},
		});
	} catch (error) {
		console.error("Failed to delete expense category: ", error);
		throw new Error("Failed to delete expense category");
	}
};
