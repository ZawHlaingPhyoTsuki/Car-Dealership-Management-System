"use server";

import { headers } from "next/headers";
import type * as z from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateCarSchema } from "../validation";

export const createCar = async (data: z.infer<typeof CreateCarSchema>) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Unauthorized");
	}
	try {
		const validatedData = CreateCarSchema.parse(data);

		const car = await prisma.car.create({
			data: validatedData,
		});

		return car;
	} catch (error) {
		console.error("Failed to create car:", error);
		throw error;
	}
};
