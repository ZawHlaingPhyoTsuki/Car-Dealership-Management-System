"use server";

import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import prisma from "@/lib/prisma";

export async function getDashboardStats() {
	const currentMonthStart = startOfMonth(new Date());
	const currentMonthEnd = endOfMonth(new Date());
	const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
	const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

	// Cars sold this month
	const carsSoldCurrentMonth = await prisma.car.count({
		where: {
			status: "SOLD",
			soldAt: {
				gte: currentMonthStart,
				lte: currentMonthEnd,
			},
		},
	});

	// Cars sold last month
	const carsSoldLastMonth = await prisma.car.count({
		where: {
			status: "SOLD",
			soldAt: {
				gte: lastMonthStart,
				lte: lastMonthEnd,
			},
		},
	});

	// Revenue current month
	const revenueCurrentMonth = await prisma.car.aggregate({
		_sum: {
			price: true,
		},
		where: {
			status: "SOLD",
			soldAt: {
				gte: currentMonthStart,
				lte: currentMonthEnd,
			},
		},
	});

	// Revenue last month
	const revenueLastMonth = await prisma.car.aggregate({
		_sum: {
			price: true,
		},
		where: {
			status: "SOLD",
			soldAt: {
				gte: lastMonthStart,
				lte: lastMonthEnd,
			},
		},
	});

	// Expenses current month
	const expensesCurrentMonth = await prisma.expense.aggregate({
		_sum: {
			amount: true,
		},
		where: {
			date: {
				gte: currentMonthStart,
				lte: currentMonthEnd,
			},
		},
	});

	// Expenses last month
	const expensesLastMonth = await prisma.expense.aggregate({
		_sum: {
			amount: true,
		},
		where: {
			date: {
				gte: lastMonthStart,
				lte: lastMonthEnd,
			},
		},
	});

	const totalRevenueCurrent = revenueCurrentMonth._sum.price ?? 0;
	const totalRevenueLast = revenueLastMonth._sum.price ?? 0;
	const totalExpensesCurrent = expensesCurrentMonth._sum.amount ?? 0;
	const totalExpensesLast = expensesLastMonth._sum.amount ?? 0;
	const profitCurrent = totalRevenueCurrent - totalExpensesCurrent;
	const profitLast =
		(revenueLastMonth._sum.price ?? 0) - (expensesLastMonth._sum.amount ?? 0);

	return {
		// Current month stats
		carsSoldCurrentMonth,
		totalRevenueCurrent,
		totalExpensesCurrent,
		profitCurrent,

		// Last month stats
		carsSoldLastMonth,
		totalRevenueLast,
		totalExpensesLast,
		profitLast,

		// Diff
		carsSoldDiff: carsSoldCurrentMonth - carsSoldLastMonth,
		totalRevenueDiff: totalRevenueCurrent - totalRevenueLast,
		totalExpensesDiff: totalExpensesCurrent - totalExpensesLast,
		profitDiff: profitCurrent - profitLast,
	};
}
