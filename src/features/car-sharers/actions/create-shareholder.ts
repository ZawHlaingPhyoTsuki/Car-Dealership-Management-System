"use server";

import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import {
	CreateCarSharerSchema,
	type CreateCarSharerValues,
} from "../validation";

export const createShareholder = async (data: CreateCarSharerValues) => {
	await requireAuth();

	try {
		const validatedData = CreateCarSharerSchema.parse(data);
		return await prisma.shareholder.create({
			data: {
				name: validatedData.name,
				phone: validatedData.phone,
				notes: validatedData.notes,
			},
			select: {
				id: true,
				name: true,
				phone: true,
				notes: true,
			},
		});
	} catch (error) {
		console.error("Failed to create shareholder:", error);
		throw new Error("Failed to create shareholder");
	}
};
