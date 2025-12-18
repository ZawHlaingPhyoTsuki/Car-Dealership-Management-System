"use server";

import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";

export async function getCarsSold() {
	await requireAuth();

	try {
		// Get only sold cars
		const soldCars = await prisma.car.findMany({
			where: {
				deletedAt: null,
				status: "SOLD",
				soldAt: {
					not: null,
				},
			},
			include: {
				shareholder: true,
			},
			orderBy: {
				soldAt: "desc",
			},
		});

		const results = soldCars.map((car) => {
			const salePrice = car.price || 0;
			const commissionPct = car.shareholderPercentage || 0;

			// Calculate commission
			const commission =
				commissionPct > 0 ? Math.round(salePrice * (commissionPct / 100)) : 0;

			// Calculate company revenue
			const companyRevenue = salePrice - commission;

			// Get sharer name
			const sharer = car.shareholder?.name;

			return {
				id: car.id,
				name: car.name,
				salePrice,
				sharer,
				commissionPct,
				commission,
				companyRevenue,
				// biome-ignore lint: false positive
				soldDate: car.soldAt!,
			};
		});

		return results;
	} catch (error) {
		console.error("Failed to fetch sold cars:", error);
		throw new Error("Failed to fetch sold cars");
	}
}

export type SoldCar = Awaited<ReturnType<typeof getCarsSold>>[number];
