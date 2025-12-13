"use server";

import prisma from "@/lib/prisma";

export async function getExpenses() {
	return await prisma.expense.findMany({
		where: {
			deletedAt: null,
		},
		select: {
			id: true,
			date: true,
			amount: true,
			category: true,
			notes: true,
			paidTo: {
				select: {
					id: true,
					name: true,
				},
			},
			car: {
				select: {
					id: true,
					name: true,
				},
			},
		},
		orderBy: { date: "desc" },
	});
}
