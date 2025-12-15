"use server";

import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";

export async function getExpenses() {
	await requireAuth();

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
					phone: true,
				},
			},
			car: {
				select: {
					id: true,
					name: true,
					color: true,
					photos: {
						select: {
							id: true,
							url: true,
							alt: true,
						},
					},
				},
			},
		},
		orderBy: { date: "desc" },
	});
}

export type Expense = Awaited<ReturnType<typeof getExpenses>>[number];
