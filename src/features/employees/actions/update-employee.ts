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
			UpdateEmployeeSchema.parse(data);
		return await prisma.employee.update({
			where: {
				id,
			},
			data: {
				...(name !== undefined ? { name } : {}),
				...(email !== undefined ? { email } : {}),
				...(position !== undefined ? { position } : {}),
				...(phone !== undefined ? { phone } : {}),
				...(address !== undefined ? { address } : {}),
				...(salary !== undefined ? { salary } : {}),
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
