"use server";

import { format } from "date-fns";
import { requireAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";

export async function getCarProfitSummary() {
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
			select: {
				id: true,
				name: true,
				sellingPrice: true,
				soldAt: true,
			},
			orderBy: {
				soldAt: "desc",
			},
		});

		// Group by month
		const monthlyProfits: Record<
			string,
			{
				month: string;
				carsSold: number;
				totalSellingPrice: number;
			}
		> = {};

		soldCars.forEach((car) => {
			if (!car.soldAt) return;

			const monthKey = format(car.soldAt, "yyyy-MM");
			const monthName = format(car.soldAt, "yyyy MMMM");

			if (!monthlyProfits[monthKey]) {
				monthlyProfits[monthKey] = {
					month: monthName,
					carsSold: 0,
					totalSellingPrice: 0, // Sum of selling prices
				};
			}

			monthlyProfits[monthKey].carsSold += 1;
			monthlyProfits[monthKey].totalSellingPrice += car.sellingPrice || 0;
		});

		// Convert to array and sort by month (descending)
		const result = Object.entries(monthlyProfits)
			.sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
			.map(([, value]) => value);

		return result;
	} catch (error) {
		console.error("Failed to fetch car profit summary:", error);
		throw new Error("Failed to fetch car profit summary");
	}
}

export type CarProfitSummary = Awaited<
	ReturnType<typeof getCarProfitSummary>
>[number];
