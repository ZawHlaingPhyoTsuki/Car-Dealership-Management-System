"use server";

import * as z from "zod";
import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";

export const deleteCar = async (id: string) => {
	z.uuid().parse(id);

	await requireAuth();

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
