"use server";

import * as z from "zod";
import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { CreateEmployeeSchema } from "../validation";

export const createEmployee = async (
	data: z.infer<typeof CreateEmployeeSchema>,
) => {
	await requireAuth();

	try {
		const validatedData = CreateEmployeeSchema.parse(data);
		return await prisma.employee.create({
			data: validatedData,
		});
	} catch (error) {
		console.error("Failed to create employee:", error);
		// Re-throw validation errors with details
		if (error instanceof z.ZodError) {
			throw error;
		}
		// Preserve database errors (e.g., unique constraint violations)
		throw error;
	}
};
