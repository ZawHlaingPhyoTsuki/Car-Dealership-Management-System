"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const getShareholders = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Unauthorized");
	}

	try {
		const shareholders = await prisma.shareholder.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				phone: true,
			},
			orderBy: {
				name: "asc",
			},
		});

		return shareholders;
	} catch (error) {
		console.error("Failed to get shareholders:", error);
		throw new Error("Failed to get shareholders");
	}
};
