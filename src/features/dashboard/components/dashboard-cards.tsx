"use client";

import {
	BanknoteArrowUp,
	CarFront,
	DollarSign,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { isLakhs } from "@/lib/utils";
import { useDashboardStats } from "../queries/use-dashboard";

// Format currency in lakhs
function formatLakhs(amount: number): string {
	return (amount / 100000).toFixed(2);
}

export default function DashboardCards() {
	const { data, isLoading } = useDashboardStats();

	if (isLoading) return <div>Loading...</div>;

	const safeData = data || {
		carsSoldCurrentMonth: 0,
		totalRevenueCurrent: 0,
		totalExpensesCurrent: 0,
		profitCurrent: 0,

		carsSoldLastMonth: 0,
		totalRevenueLast: 0,
		totalExpensesLast: 0,
		profitLast: 0,

		carsSoldDiff: 0,
		totalRevenueDiff: 0,
		totalExpensesDiff: 0,
		profitDiff: 0,
	};

	return (
		<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
			{/* Cars Sold Card */}
			<Card className="@container/card">
				<CardHeader>
					<CardDescription className="flex items-center gap-2">
						<CarFront className="w-4 h-4" />
						Car Sales
					</CardDescription>

					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						<span
							className={`${safeData.carsSoldDiff >= 0 ? "text-green-500" : "text-red-500"}`}
						>
							{safeData.carsSoldCurrentMonth}
						</span>
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							{safeData.carsSoldDiff >= 0 ? (
								<TrendingUp className="text-green-500" />
							) : (
								<TrendingDown className="text-red-500" />
							)}
							{safeData.carsSoldDiff >= 0 ? "+" : "-"}
							{Math.abs(safeData.carsSoldDiff)}{" "}
							{Math.abs(safeData.carsSoldDiff) !== 1 ? "cars" : "car"}
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						{safeData.carsSoldDiff >= 0
							? "Selling up this month"
							: "Selling down this month"}
						{safeData.carsSoldDiff >= 0 ? (
							<TrendingUp className="size-4 text-green-500" />
						) : (
							<TrendingDown className="size-4 text-red-500" />
						)}
					</div>
					<div className="text-muted-foreground">
						{safeData.carsSoldDiff >= 0
							? "More sales than last month"
							: "Fewer sales than last month"}
					</div>
				</CardFooter>
			</Card>

			{/* Revenue Card */}
			<Card className="@container/card">
				<CardHeader>
					<CardDescription className="flex items-center gap-2">
						<DollarSign className="w-4 h-4" /> Profit Overview
					</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						<span
							className={`${safeData.totalRevenueDiff >= 0 ? "text-green-500" : "text-red-500"}`}
						>
							{isLakhs(safeData.totalRevenueCurrent)
								? formatLakhs(safeData.totalRevenueCurrent)
								: safeData.totalRevenueCurrent}
						</span>{" "}
						<span className="text-xl text-muted-foreground">
							{isLakhs(safeData.totalRevenueCurrent) ? "lakhs" : "Ks"}
						</span>
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							{safeData.totalRevenueDiff >= 0 ? (
								<TrendingUp className="text-green-500" />
							) : (
								<TrendingDown className="text-red-500" />
							)}
							{safeData.totalRevenueDiff >= 0 ? "+" : "-"}
							{isLakhs(Math.abs(safeData.totalRevenueDiff))
								? `${formatLakhs(Math.abs(safeData.totalRevenueDiff))} lakhs`
								: `${Math.abs(safeData.totalRevenueDiff)} Ks`}
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						{safeData.totalRevenueDiff >= 0
							? `Up ${
									isLakhs(Math.abs(safeData.totalRevenueDiff))
										? `${formatLakhs(Math.abs(safeData.totalRevenueDiff))} lakhs`
										: `${Math.abs(safeData.totalRevenueDiff)} Ks`
								} this month`
							: `Down ${
									isLakhs(Math.abs(safeData.totalRevenueDiff))
										? `${formatLakhs(Math.abs(safeData.totalRevenueDiff))} lakhs`
										: `${Math.abs(safeData.totalRevenueDiff)} Ks`
								} this month`}{" "}
						{safeData.totalRevenueDiff >= 0 ? (
							<TrendingUp className="size-4 text-green-500" />
						) : (
							<TrendingDown className="size-4 text-red-500" />
						)}
					</div>
					<div className="text-muted-foreground">
						{safeData.totalRevenueDiff >= 0
							? "Did a great job"
							: "Needs improvement"}
					</div>
				</CardFooter>
			</Card>

			{/* Expenses Card */}
			<Card className="@container/card">
				<CardHeader>
					<CardDescription className="flex items-center gap-2">
						<BanknoteArrowUp className="w-4 h-4" /> Total Expenses
					</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						<span
							className={`${safeData.totalExpensesDiff <= 0 ? "text-green-500" : "text-red-500"}`}
						>
							{isLakhs(safeData.totalExpensesCurrent)
								? formatLakhs(safeData.totalExpensesCurrent)
								: safeData.totalExpensesCurrent}
						</span>{" "}
						{isLakhs(safeData.totalExpensesCurrent) ? (
							<span className="text-xl text-muted-foreground">lakhs</span>
						) : (
							<span className="text-xl text-muted-foreground">Ks</span>
						)}
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							{safeData.totalExpensesDiff <= 0 ? (
								<TrendingDown className="text-green-500" />
							) : (
								<TrendingUp className="text-red-500" />
							)}
							{safeData.totalExpensesDiff >= 0 ? "+" : "-"}
							{isLakhs(Math.abs(safeData.totalExpensesDiff))
								? formatLakhs(Math.abs(safeData.totalExpensesDiff))
								: Math.abs(safeData.totalExpensesDiff)}{" "}
							Ks
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						{safeData.totalExpensesDiff <= 0
							? "Good spending"
							: "Higher spending"}{" "}
						{safeData.totalExpensesDiff <= 0 ? (
							<TrendingDown className="size-4 text-green-500" />
						) : (
							<TrendingUp className="size-4 text-red-500" />
						)}
					</div>
					<div className="text-muted-foreground">
						{safeData.totalExpensesDiff <= 0
							? "Less than last month"
							: "More than last month"}
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
