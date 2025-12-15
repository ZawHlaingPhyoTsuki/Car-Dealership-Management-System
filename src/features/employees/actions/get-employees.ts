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
			position: true,
			salary: true,
			percentage: true,
			startDate: true,
		},
		orderBy: { createdAt: "desc" },
	});
}
