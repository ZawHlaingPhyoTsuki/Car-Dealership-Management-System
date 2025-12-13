"use server";

import prisma from "@/lib/prisma";

export const deleteEmployee = async (id: string) => {
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
