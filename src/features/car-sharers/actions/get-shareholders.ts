"use server";

import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";

export const getShareholders = async () => {
	await requireAuth();

	try {
		const shareholders = await prisma.shareholder.findMany({
			where: {
				deletedAt: null,
			},
			select: {
				id: true,
				name: true,
				email: true,
				phone: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return shareholders;
	} catch (error) {
		console.error("Failed to get shareholders:", error);
		throw new Error("Failed to get shareholders");
	}
};
