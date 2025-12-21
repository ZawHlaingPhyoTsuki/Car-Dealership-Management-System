"use server";

import type { Prisma } from "@/app/generated/prisma/client";
import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { CreateExpenseSchema, type CreateExpenseValues } from "../validation";

export const createExpense = async (data: CreateExpenseValues) => {
	await requireAuth();

	try {
		const { paidToId, carId, categoryId, ...validatedData } =
			CreateExpenseSchema.parse(data);

		const updateData: Prisma.ExpenseCreateInput = {
			date: validatedData.date,
			amount: validatedData.amount,
			notes: validatedData.notes || null,

			paidTo: paidToId ? { connect: { id: paidToId } } : undefined,
			car: carId ? { connect: { id: carId } } : undefined,
			category: categoryId ? { connect: { id: categoryId } } : undefined,
		};

		return await prisma.expense.create({
			data: updateData,
		});
	} catch (error) {
		console.error("Failed to create expense: ", error);
		throw new Error("Failed to create expense");
	}
};
