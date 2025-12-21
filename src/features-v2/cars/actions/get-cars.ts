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
			include: {
				expenses: {
					where: {
						deletedAt: null,
					},
					select: {
						amount: true,
					},
				},
				shareholder: {
					select: {
						id: true,
						name: true,
						phone: true,
						createdAt: true,
					},
				},
				photos: {
					where: {
						deletedAt: null,
					},
					select: {
						id: true,
						url: true,
					},
					take: 1, // Just get first photo for thumbnail
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		// Calculate derived fields for each car
		return cars.map((car) => {
			// Calculate total expenses from related expenses
			const totalExpenses = car.expenses.reduce(
				(sum, expense) => sum + expense.amount,
				0,
			);

			// Calculate total cost
			const totalCost = car.purchasedPrice + totalExpenses;

			// Calculate profit amount (only if selling price is greater than 0)
			const profitAmount =
				car.sellingPrice > 0 ? car.sellingPrice - totalCost : 0;

			return {
				id: car.id,
				name: car.name,
				purchasedPrice: car.purchasedPrice,
				sellingPrice: car.sellingPrice,
				companyInvestedAmount: car.companyInvestedAmount,
				shareholderInvestedAmount: car.shareholderInvestedAmount,
				companyProfitAmount: car.companyProfitAmount,
				shareholderProfitAmount: car.shareholderProfitAmount,
				licenseNumber: car.licenseNumber,
				notes: car.notes,
				status: car.status,
				soldAt: car.soldAt,
				shareholderId: car.shareholderId,
				shareholder: car.shareholder,
				photos: car.photos,
				createdAt: car.createdAt,

				// Calculated fields
				totalExpenses,
				totalCost,
				profitAmount,
			};
		});
	} catch (error) {
		console.error("Failed to fetch cars:", error);
		throw new Error("Failed to fetch cars");
	}
}

export type Car = Awaited<ReturnType<typeof getCars>>[number];
