"use server";

import * as z from "zod";
import { Prisma } from "@/app/generated/prisma/client";
import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { UpdateEmployeeSchema } from "../validation";

export const updateEmployee = async (
	id: string,
	data: z.infer<typeof UpdateEmployeeSchema>,
) => {
	await requireAuth();

	try {
		const { name, email, position, phone, address, salary } =
			UpdateEmployeeSchema.parse({
				...data,
				// phone: data.phone ?? undefined,
				// address: data.address ?? undefined,
			});
		return await prisma.employee.update({
			where: {
				id,
			},
			data: {
				name,
				email,
				position,
				phone: phone ?? null,
				address: address ?? null,
				salary,
			},
			select: {
				id: true,
				name: true,
				email: true,
				position: true,
				phone: true,
				address: true,
				salary: true,
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
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2002") {
				throw new Error("Email already exists");
			}
		}
		// Preserve database errors (e.g., unique constraint violations)
		throw error;
	}
};
