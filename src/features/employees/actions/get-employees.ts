"use server";

import prisma from "@/lib/prisma";

export async function getEmployees() {
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
