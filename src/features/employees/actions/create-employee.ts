"use server";

import type { Prisma } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";

export const createEmployee = async (data: Prisma.EmployeeCreateInput) => {
	return await prisma.employee.create({
		data,
	});
};
