"use server";

import type * as z from "zod";
import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { UpdateCarSchema } from "../validation";

export const updateCar = async (data: z.infer<typeof UpdateCarSchema>) => {
	await requireAuth();

	try {
		const { id, ...updateData } = UpdateCarSchema.parse(data);

		const car = await prisma.car.update({
			where: { id },
			data: {
				...updateData,
				soldAt: updateData.status === "SOLD" ? new Date() : null,
			},
		});

		return car;
	} catch (error) {
		console.error("Failed to update car:", error);
		throw new Error("Failed to update car");
	}
};
