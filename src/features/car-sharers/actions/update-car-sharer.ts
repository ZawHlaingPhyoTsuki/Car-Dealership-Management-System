"use server";

import type * as z from "zod";
import type { Prisma } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";
import { UpdateCarSharerSchema } from "../validation";

export const updateCarSharer = async (
	data: z.infer<typeof UpdateCarSharerSchema>,
) => {
	try {
		const {
			id,
			shareholderName,
			shareholderEmail,
			shareholderPhone,
			...updateData
		} = UpdateCarSharerSchema.parse(data);

		let shareholderUpdate:
			| Prisma.ShareholderUpdateOneWithoutCarsNestedInput
			| undefined;

		if (shareholderName === "") {
			// If shareholder name is empty string, disconnect
			shareholderUpdate = { disconnect: true };
		} else if (updateData.shareholderId) {
			// If we have a shareholderId, connect and update that shareholder
			shareholderUpdate = {
				connect: { id: updateData.shareholderId },
				update: {
					name: shareholderName || undefined,
					email: shareholderEmail || undefined,
					phone: shareholderPhone || undefined,
				},
			};
		} else if (shareholderName) {
			// If we have a name but no ID, first check if a shareholder with this name exists
			const existingShareholder = await prisma.shareholder.findFirst({
				where: {
					name: shareholderName,
				},
			});

			if (existingShareholder) {
				// If exists, connect to the existing one and update
				shareholderUpdate = {
					connect: { id: existingShareholder.id },
					update: {
						name: shareholderName,
						email: shareholderEmail || undefined,
						phone: shareholderPhone || undefined,
					},
				};
			} else {
				// If doesn't exist, create a new one
				shareholderUpdate = {
					create: {
						name: shareholderName,
						email: shareholderEmail || null,
						phone: shareholderPhone || null,
					},
				};
			}
		}

		const carSharer = await prisma.car.update({
			where: { id },
			data: {
				price: updateData.price,
				shareholderPercentage: updateData.shareholderPercentage,
				investmentAmount: updateData.investmentAmount,
				shareholder: shareholderUpdate,
			},
		});

		return carSharer;
	} catch (error) {
		console.error("Failed to update car sharer:", error);
		throw new Error("Failed to update car sharer");
	}
};