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
			notes: true,
			category: {
				select: {
					id: true,
					name: true,
				},
			},
			paidTo: {
				select: {
					id: true,
					name: true,
					position: true,
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
		orderBy: { createdAt: "desc" },
	});
}

export type Expense = Awaited<ReturnType<typeof getExpenses>>[number];
