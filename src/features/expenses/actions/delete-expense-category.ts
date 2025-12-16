"use server";

import * as z from "zod";
import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";

export const deleteExpenseCategory = async (id: string) => {
	await requireAuth();

	try {
		z.uuid().parse(id);

		const expenseCategory = await prisma.expenseCategory.findFirst({
			where: {
				id,
				deletedAt: null,
			},
		});
		if (!expenseCategory) {
			throw new Error("Expense category not found");
		}

		return await prisma.expenseCategory.update({
			where: {
				id,
			},
			data: {
				deletedAt: new Date(),
			},
		});
	} catch (error) {
		console.error("Failed to delete expense category: ", error);
		throw new Error("Failed to delete expense category");
	}
};
