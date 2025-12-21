"use server";

import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { UpdateEmployeeSchema, type UpdateEmployeeValues } from "../validation";

export const updateEmployee = async (data: UpdateEmployeeValues) => {
	await requireAuth();

	try {
		const { id, name, position, salary, percentage, startDate } =
			UpdateEmployeeSchema.parse(data);

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
		throw new Error("Failed to update employee");
	}
};
