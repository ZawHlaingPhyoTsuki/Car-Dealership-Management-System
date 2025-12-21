"use server";

import { CarStatus, type Prisma } from "@/app/generated/prisma/client";
import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { CreateCarSchema, type CreateCarValues } from "../validation";

export async function createCar(values: CreateCarValues) {
	await requireAuth();

	try {
		const { shareholderId, ...validatedData } = CreateCarSchema.parse(values);

		const createDate: Prisma.CarCreateInput = {
			name: validatedData.name,
			status: validatedData.status,

			purchasedPrice: validatedData.purchasedPrice,
			sellingPrice: validatedData.sellingPrice,
			companyInvestedAmount: validatedData.companyInvestedAmount,
			shareholderInvestedAmount: validatedData.shareholderInvestedAmount,

			companyProfitAmount: validatedData.companyProfitAmount,
			shareholderProfitAmount: validatedData.shareholderProfitAmount,

			licenseNumber: validatedData.licenseNumber || null,
			soldAt:
				validatedData.status === CarStatus.SOLD ? validatedData.soldAt : null,
			notes: validatedData.notes || null,
		};

		const car = await prisma.car.create({
			data: {
				...createDate,
				shareholder: shareholderId
					? { connect: { id: shareholderId } }
					: undefined,
			},
		});
		return car;
	} catch (error) {
		console.error("Failed to create car:", error);
		throw new Error("Failed to create car");
	}
}
