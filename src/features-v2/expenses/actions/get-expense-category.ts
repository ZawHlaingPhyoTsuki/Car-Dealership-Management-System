"use server";

import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";

export const getExpenseCategories = async () => {
	await requireAuth();

	return await prisma.expenseCategory.findMany({
		where: {
			deletedAt: null,
		},
		select: {
			id: true,
			name: true,
			createdAt: true,
		},
		orderBy: { createdAt: "desc" },
	});
};
