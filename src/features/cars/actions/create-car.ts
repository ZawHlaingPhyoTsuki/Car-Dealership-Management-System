"use server";

import type * as z from "zod";
import { CarStatus } from "@/app/generated/prisma/enums";
import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { CreateCarSchema } from "../validation";

export const createCar = async (data: z.infer<typeof CreateCarSchema>) => {
	await requireAuth();
	try {
		const validatedData = CreateCarSchema.parse(data);

		const car = await prisma.car.create({
			data: {
				...validatedData,
				licenseNumber: validatedData.licenseNumber || null,
				color: validatedData.color || null,
				notes: validatedData.notes || null,
				soldAt:
					validatedData.status === CarStatus.SOLD ? validatedData.soldAt : null,
			},
		});

		return car;
	} catch (error) {
		console.error("Failed to create car:", error);
		throw new Error("Failed to create car");
	}
};
