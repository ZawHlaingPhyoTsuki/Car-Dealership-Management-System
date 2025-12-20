"use server";

import type * as z from "zod";
import { Prisma } from "@/app/generated/prisma/client";
import { CarStatus } from "@/app/generated/prisma/enums";
import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { CreateCarSchema } from "../validation";

export const createCar = async (data: z.infer<typeof CreateCarSchema>) => {
	await requireAuth();
	try {
		const { shareholderId, ...validatedData } = CreateCarSchema.parse(data);

		console.log("Creating car with data:", {
			...validatedData,
			shareholderId,
		});

		const createData = {
			name: validatedData.name,
			price: validatedData.price,
			licenseNumber: validatedData.licenseNumber || null,
			notes: validatedData.notes || null,
			status: validatedData.status,
			soldAt:
				validatedData.status === CarStatus.SOLD ? validatedData.soldAt : null,
		} as Prisma.CarCreateInput;

		if (shareholderId) {
			createData.shareholder = { connect: { id: shareholderId } };

			if (validatedData.shareholderPercentage !== undefined) {
				createData.shareholderPercentage = validatedData.shareholderPercentage;
			}

			if (validatedData.investmentAmount !== undefined) {
				createData.investmentAmount = validatedData.investmentAmount;
			}
		}

		const car = await prisma.car.create({
			data: createData,
		});

		return car;
	} catch (error) {
		console.error("Failed to create car:", error);

		// Log the full error for debugging
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error("Prisma error details:", error.meta);
		}

		throw new Error("Failed to create car");
	}
};
