"use server";

import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { CreateEmployeeSchema, type CreateEmployeeValues } from "../validation";

export const createEmployee = async (data: CreateEmployeeValues) => {
	await requireAuth();

	try {
		const validatedData = CreateEmployeeSchema.parse(data);

		return await prisma.employee.create({
			data: validatedData,
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
		console.error("Failed to create employee:", error);
		throw new Error("Failed to create employee");
	}
};
