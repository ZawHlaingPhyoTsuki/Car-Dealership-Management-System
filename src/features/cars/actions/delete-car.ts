"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const deleteCar = async (id: string) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Unauthorized");
	}

	try {
		const car = await prisma.car.update({
			where: { id },
			data: {
				deletedAt: new Date(),
			},
		});

		return car;
	} catch (error) {
		console.error("Failed to delete car:", error);
		throw new Error("Failed to delete car");
	}
};
