"use server";

import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";

export const deleteEmployee = async (id: string) => {
	await requireAuth();

	return await prisma.employee.update({
		where: {
			id,
		},
		data: {
			deletedAt: new Date(),
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
};
