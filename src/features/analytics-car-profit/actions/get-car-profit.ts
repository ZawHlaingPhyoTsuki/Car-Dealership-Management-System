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
				price: true,
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
				totalProfit: number;
				cars: typeof soldCars;
			}
		> = {};

		soldCars.forEach((car) => {
			if (!car.soldAt) return;

			const monthKey = format(car.soldAt, "yyyy-MM");
			const monthName = format(car.soldAt, "MMMM yyyy");

			if (!monthlyProfits[monthKey]) {
				monthlyProfits[monthKey] = {
					month: monthName,
					carsSold: 0,
					totalProfit: 0,
					cars: [],
				};
			}

			monthlyProfits[monthKey].carsSold += 1;
			monthlyProfits[monthKey].totalProfit += car.price;
			monthlyProfits[monthKey].cars.push(car);
		});

		// Convert to array and sort by month (descending)
		const result = Object.values(monthlyProfits).sort((a, b) => {
			const dateA = new Date(a.month);
			const dateB = new Date(b.month);
			return dateB.getTime() - dateA.getTime();
		});

		return result;
	} catch (error) {
		console.error("Failed to fetch car profit summary:", error);
		throw new Error("Failed to fetch car profit summary");
	}
}

export type CarProfitSummary = Awaited<
	ReturnType<typeof getCarProfitSummary>
>[number];
