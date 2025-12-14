"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const deleteEmployee = async (id: string) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Unauthorized");
	}

	return await prisma.employee.update({
		where: {
			id,
		},
		data: {
			deletedAt: new Date(),
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
	});
};
