"use server";

import * as z from "zod";
import type { Prisma } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";
import { CreateEmployeeSchema } from "../validation";

export const createEmployee = async (data: Prisma.EmployeeCreateInput) => {
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
