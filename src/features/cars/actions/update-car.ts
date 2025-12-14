"use server";

import { headers } from "next/headers";
import type * as z from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UpdateCarSchema } from "../validation";

export const updateCar = async (data: z.infer<typeof UpdateCarSchema>) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Unauthorized");
	}

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
