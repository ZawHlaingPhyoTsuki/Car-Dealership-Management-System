"use server";

import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { CreateExpenseSchema, type CreateExpenseValues } from "../validation";

export const createExpense = async (data: CreateExpenseValues) => {
	await requireAuth();

	try {
		const validatedData = CreateExpenseSchema.parse(data);
		const { paidToId, carId, categoryId, ...rest } = validatedData;

		return await prisma.expense.create({
			data: {
				...rest,
				//making connection sure, OR just ids
				paidTo: paidToId ? { connect: { id: paidToId } } : undefined,
				car: carId ? { connect: { id: carId } } : undefined,
				category: categoryId ? { connect: { id: categoryId } } : undefined,
			},
		});
	} catch (error) {
		console.error("Failed to create expense: ", error);
		throw new Error("Failed to create expense");
	}
};
