"use server";

import type * as z from "zod";
import prisma from "@/lib/prisma";
import { UpdateCarSchema } from "../validation";

export const updateCar = async (data: z.infer<typeof UpdateCarSchema>) => {
	try {
		const { id, ...updateData } = UpdateCarSchema.parse(data);

		const car = await prisma.car.update({
			where: { id },
			data: updateData,
		});

		return car;
	} catch (error) {
		console.error("Failed to update car:", error);
		throw new Error("Failed to update car");
	}
};
