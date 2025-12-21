"use server";

import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import prisma from "@/lib/prisma";

export async function getDashboardStats() {
	const currentMonthStart = startOfMonth(new Date());
	const currentMonthEnd = endOfMonth(new Date());
	const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
	const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

	// Get cars sold in current month for revenue and profit calculations
	const currentMonthCars = await prisma.car.findMany({
		where: {
			status: "SOLD",
			soldAt: {
				gte: currentMonthStart,
				lte: currentMonthEnd,
			},
		},
		select: {
			purchasedPrice: true,
			sellingPrice: true,
		},
	});

	// Get cars sold in last month for revenue and profit calculations
	const lastMonthCars = await prisma.car.findMany({
		where: {
			status: "SOLD",
			soldAt: {
				gte: lastMonthStart,
				lte: lastMonthEnd,
			},
		},
		select: {
			purchasedPrice: true,
			sellingPrice: true,
		},
	});

	// Calculate selling price and profit for current month
	const totalSellingPriceCurrent = currentMonthCars.reduce(
		(sum, car) => sum + (car.sellingPrice || 0),
		0,
	);
	const totalPurchasedPriceCurrent = currentMonthCars.reduce(
		(sum, car) => sum + (car.purchasedPrice || 0),
		0,
	);

	// Calculate revenue and profit for last month
	const totalSellingPriceLastMonth = lastMonthCars.reduce(
		(sum, car) => sum + (car.sellingPrice || 0),
		0,
	);
	const totalPurchasedPriceLastMonth = lastMonthCars.reduce(
		(sum, car) => sum + (car.purchasedPrice || 0),
		0,
	);

	return {
		// Current month stats
		carsSoldCurrentMonth: currentMonthCars.length,
		totalSellingPriceCurrent,
		totalPurchasedPriceCurrent,

		// Last month stats
		carsSoldLastMonth: lastMonthCars.length,
		totalSellingPriceLastMonth,
		totalPurchasedPriceLastMonth,

		// Diffs
		carsSoldDiff: currentMonthCars.length - lastMonthCars.length,
		totalSellingPriceDiff:
			totalSellingPriceCurrent - totalSellingPriceLastMonth,
		totalPurchasedPriceDiff:
			totalPurchasedPriceCurrent - totalPurchasedPriceLastMonth,
	};
}
