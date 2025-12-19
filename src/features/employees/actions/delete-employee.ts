"use server";

import * as z from "zod";
import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";

export const deleteEmployee = async (id: string) => {
	await requireAuth();

	z.uuid().parse(id);

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
			position: true,
			salary: true,
			percentage: true,
			startDate: true,
		},
	});
};
