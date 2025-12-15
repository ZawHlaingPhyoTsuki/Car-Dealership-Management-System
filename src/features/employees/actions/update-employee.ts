"use server";

import * as z from "zod";
import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { UpdateEmployeeSchema } from "../validation";

export const updateEmployee = async (
	data: z.infer<typeof UpdateEmployeeSchema>,
) => {
	await requireAuth();

	try {
		const { id, name, position, salary, percentage, startDate } =
			UpdateEmployeeSchema.parse({
				...data,
			});
		return await prisma.employee.update({
			where: {
				id,
			},
			data: {
				name,
				position,
				salary,
				percentage,
				startDate,
			},
			select: {
				id: true,
				name: true,
				position: true,
				salary: true,
				percentage: true,
				startDate: true,
			},
		});
	} catch (error) {
		console.error("Failed to update employee:", error);
		// Re-throw validation errors with details
		if (error instanceof z.ZodError) {
			throw new Error(
				`Validation failed: ${error.issues.map((e) => e.message).join(", ")}`,
			);
		}
		throw error;
	}
};
