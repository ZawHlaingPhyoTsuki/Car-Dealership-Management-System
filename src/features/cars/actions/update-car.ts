"use server";

import { Prisma } from "@/app/generated/prisma/client";
import { CarStatus } from "@/app/generated/prisma/enums";
import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { UpdateCarSchema, type UpdateCarValues } from "../validation";

export const updateCar = async (data: UpdateCarValues) => {
	await requireAuth();

	try {
		const { id, ...validatedData } = UpdateCarSchema.parse(data);

		// Check if car exists
		const existingCar = await prisma.car.findUnique({
			where: { id },
		});

		if (!existingCar) {
			throw new Error("Car not found");
		}

		const updateData: Prisma.CarUpdateInput = {};

		if (validatedData.name !== undefined) {
			updateData.name = validatedData.name;
		}

		if (validatedData.purchasedPrice !== undefined) {
			updateData.purchasedPrice = validatedData.purchasedPrice;
		}

		if (validatedData.sellingPrice !== undefined) {
			updateData.sellingPrice = validatedData.sellingPrice;
		}

		if (validatedData.companyInvestedAmount !== undefined) {
			updateData.companyInvestedAmount = validatedData.companyInvestedAmount;
		}

		if (validatedData.shareholderInvestedAmount !== undefined) {
			updateData.shareholderInvestedAmount =
				validatedData.shareholderInvestedAmount;
		}

		if (validatedData.companyProfitAmount !== undefined) {
			updateData.companyProfitAmount = validatedData.companyProfitAmount;
		}

		if (validatedData.shareholderProfitAmount !== undefined) {
			updateData.shareholderProfitAmount =
				validatedData.shareholderProfitAmount;
		}

		if (validatedData.licenseNumber !== undefined) {
			updateData.licenseNumber = validatedData.licenseNumber;
		}

		if (validatedData.notes !== undefined) {
			updateData.notes = validatedData.notes;
		}

		if (validatedData.status !== undefined) {
			updateData.status = validatedData.status;

			if (validatedData.status === CarStatus.SOLD) {
				updateData.soldAt = validatedData.soldAt || new Date();
			} else {
				updateData.soldAt = null;
			}
		}

		if (validatedData.shareholderId !== undefined) {
			if (validatedData.shareholderId === null) {
				updateData.shareholder = { disconnect: true };
			} else {
				updateData.shareholder = {
					connect: { id: validatedData.shareholderId },
				};
			}
		}

		const car = await prisma.car.update({
			where: { id },
			data: updateData,
		});

		return car;
	} catch (error) {
		console.error("Failed to update car:", error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2002") {
				throw new Error("A car with this name already exists");
			}
			if (error.code === "P2025") {
				throw new Error("Car not found");
			}
		}

		throw new Error("Failed to update car");
	}
};
