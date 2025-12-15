"use server";

import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";

export const deleteExpense = async (id: string) => {
	await requireAuth();

	return await prisma.expense.update({
		where: {
			id,
		},
		data: {
			deletedAt: new Date(),
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
	});
};
