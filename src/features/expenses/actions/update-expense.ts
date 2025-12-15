"use server";

import * as z from "zod";
import { Prisma } from "@/app/generated/prisma/client";
import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { UpdateExpenseSchema } from "../validation";

export const updateExpense = async (
	data: z.infer<typeof UpdateExpenseSchema>,
) => {
	await requireAuth();
	try {
		const { id, date, amount, paidToId, carId, category, notes } =
			UpdateExpenseSchema.parse(data);
		return await prisma.expense.update({
			where: {
				id,
			},
			data: {
				date,
				amount,
				paidToId,
				carId,
				category,
				notes: notes ?? undefined,
			},
			select: {
				id: true,
				date: true,
				amount: true,
				category: true,
				notes: true,
				paidTo: {
					select: {
						id: true,
						name: true,
					},
				},
				car: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});
	} catch (error) {
		console.error("Failed to update expense:", error);
		// Re-throw validation errors with details
		if (error instanceof z.ZodError) {
			throw new Error(
				`Validation failed: ${error.issues.map((e) => e.message).join(", ")}`,
			);
		}
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2002") {
				throw new Error("A unique constraint would be violated");
			}
			if (error.code === "P2025") {
				throw new Error("Expense not found");
			}
		}
		throw new Error("Failed to update expense");
	}
};
