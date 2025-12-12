"use server";

import type { Prisma } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";

export const updateEmployee = async (
	id: string,
	data: Prisma.EmployeeUpdateInput,
) => {
	return await prisma.employee.update({
		where: {
			id,
		},
		data,
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
};
