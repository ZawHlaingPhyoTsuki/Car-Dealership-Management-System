"use server";

import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";

export async function getCars() {
	await requireAuth();

	try {
		const cars = await prisma.car.findMany({
			where: {
				deletedAt: null,
			},
			orderBy: {
				createdAt: "desc",
			},
			select: {
				id: true,
				name: true,
				licenseNumber: true,
				color: true,
				status: true,
				price: true,
				shareholderPercentage: true,
				investmentAmount: true,
				soldAt: true,
				paidMethod: true,
				paidAmount: true,
				notes: true,
				createdAt: true,
				updatedAt: true,
				photos: {
					select: {
						id: true,
						url: true,
						alt: true,
						order: true,
					},
				},
				shareholder: {
					select: {
						id: true,
						name: true,
						email: true,
						phone: true,
						createdAt: true,
					},
				},
			},
		});
		return cars;
	} catch (error) {
		console.error("Failed to fetch cars:", error);
		throw error;
	}
}

export type Car = Awaited<ReturnType<typeof getCars>>[number];
