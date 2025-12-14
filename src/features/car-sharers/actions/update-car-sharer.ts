"use server";

import { headers } from "next/headers";
import type * as z from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UpdateCarSharerSchema } from "../validation";

export const updateCarSharer = async (
	data: z.infer<typeof UpdateCarSharerSchema>,
) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Unauthorized");
	}

	try {
		const { id, shareholderId, ...updateData } =
			UpdateCarSharerSchema.parse(data);

		const carSharer = await prisma.car.update({
			where: { id },
			data: {
				price: updateData.price,
				shareholderPercentage: updateData.shareholderPercentage,
				investmentAmount: updateData.investmentAmount,
				shareholder: shareholderId
					? { connect: { id: shareholderId } }
					: { disconnect: true },
			},
		});

		return carSharer;
	} catch (error) {
		console.error("Failed to update car sharer:", error);
		throw new Error("Failed to update car sharer");
	}
};
