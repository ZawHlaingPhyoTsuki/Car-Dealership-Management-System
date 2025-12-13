"use server";

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
		throw new Error("Failed to create employee");
	}
};
