"use server";

import * as z from "zod";
import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { CreateExpenseSchema } from "../validation";

export const createExpene = async (
	data: z.infer<typeof CreateExpenseSchema>,
) => {
	await requireAuth();
	
	try {
		const validatedData = CreateExpenseSchema.parse(data);
		const { paidToId, carId, ...rest } = validatedData;

		return await prisma.expense.create({
			data: {
				...rest,
				//making connection sure, OR just ids
				paidTo: paidToId ? { connect: { id: paidToId } } : undefined,
				car: carId ? { connect: { id: carId } } : undefined,
			},
		});
	} catch (error) {
		console.error("Failed to create expense: ", error);
		// Re-throw validation errors with details
		if (error instanceof z.ZodError) {
			throw error;
		}
		// Preserve database errors (e.g., unique constraint violations)
		throw error;
	}
};
