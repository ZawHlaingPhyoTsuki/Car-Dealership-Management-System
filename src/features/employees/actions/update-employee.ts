"use server";

import type { Prisma } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";
import { UpdateEmployeeSchema } from "../validation";

export const updateEmployee = async (
	id: string,
	data: Prisma.EmployeeUpdateInput,
) => {
	try {
		const { name, email, position, phone, address, salary } =
			UpdateEmployeeSchema.parse({
				...data,
				phone: data.phone ?? undefined,
				address: data.address ?? undefined,
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
		throw new Error("Failed to update employee");
	}
};
