"use server";

import * as z from "zod";
import { Prisma } from "@/app/generated/prisma/client";
import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { UpdateExpenseSchema, type UpdateExpenseValues } from "../validation";

export const updateExpense = async (data: UpdateExpenseValues) => {
	await requireAuth();
	try {
		const { id, date, amount, paidToId, carId, categoryId, notes } =
			UpdateExpenseSchema.parse(data);

		// Prepare the data object for Prisma
		const updateData = {} as Prisma.ExpenseUpdateInput;

		// Handle each field individually
		if (date !== undefined) updateData.date = date;
		if (amount !== undefined) updateData.amount = amount;
		if (notes !== undefined) updateData.notes = notes;

		// Handle nullable fields explicitly
		// If paidToId is null, we need to disconnect
		// If paidToId is undefined, we don't update it
		if (paidToId === null) {
			updateData.paidTo = { disconnect: true };
		} else if (paidToId !== undefined) {
			updateData.paidTo = { connect: { id: paidToId } };
		}

		// Handle carId similarly
		if (carId === null) {
			updateData.car = { disconnect: true };
		} else if (carId !== undefined) {
			updateData.car = { connect: { id: carId } };
		}

		// Handle categoryId
		if (categoryId === null) {
			updateData.category = { disconnect: true };
		} else if (categoryId !== undefined) {
			updateData.category = { connect: { id: categoryId } };
		}

		return await prisma.expense.update({
			where: {
				id,
			},
			data: updateData,
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
