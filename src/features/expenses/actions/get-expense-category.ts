"use server";

import prisma from "@/lib/prisma";

export const getExpenseCategories = async () => {
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
