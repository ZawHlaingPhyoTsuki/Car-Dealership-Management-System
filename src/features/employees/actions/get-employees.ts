"use server";

import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";

export async function getEmployees() {
	await requireAuth();

	return await prisma.employee.findMany({
		where: {
			deletedAt: null,
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
		orderBy: { startDate: "desc" },
	});
}
