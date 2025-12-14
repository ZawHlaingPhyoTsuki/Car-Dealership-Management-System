"use server";

import { headers } from "next/headers";
import * as z from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateEmployeeSchema } from "../validation";

export const createEmployee = async (
	data: z.infer<typeof CreateEmployeeSchema>,
) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Unauthorized");
	}

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
