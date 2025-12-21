"use client";

import {
	BanknoteArrowUp,
	CarFront,
	DollarSign,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isLakhs } from "@/lib/utils";
import { useDashboardStats } from "../queries/use-dashboard";
import DashboardCard, { type DashboardCardProps } from "./dashboard-card";

// Format currency in lakhs
function formatLakhs(amount: number): string {
	return (amount / 100000).toFixed(2);
}

export default function DashboardCards() {
	const { data, isLoading } = useDashboardStats();

	if (isLoading) return <div>Loading...</div>;

	const safeData = data || {
		// Current month stats
		carsSoldCurrentMonth: 0,
		totalSellingPriceCurrent: 0,
		totalPurchasedPriceCurrent: 0,

		// Last month stats
		carsSoldLastMonth: 0,
		totalSellingPriceLastMonth: 0,
		totalPurchasedPriceLastMonth: 0,

		// Diffs
		carsSoldDiff: 0,
		totalSellingPriceDiff: 0,
		totalPurchasedPriceDiff: 0,
	};

	const cards: DashboardCardProps[] = [
		// Cars Sold Card
		{
			description: "Car Sales",
			icon: CarFront,
			value: (
				<span
					className={`${safeData.carsSoldDiff >= 0 ? "text-green-500" : "text-red-500"}`}
				>
					{safeData.carsSoldCurrentMonth}
				</span>
			),
			badge: (
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
			),
			footerTitle: (
				<>
					{safeData.carsSoldDiff >= 0
						? "Selling up this month"
						: "Selling down this month"}
					{safeData.carsSoldDiff >= 0 ? (
						<TrendingUp className="size-4 text-green-500" />
					) : (
						<TrendingDown className="size-4 text-red-500" />
					)}
				</>
			),
			footerSubtitle: "Total cars sold this month",
		},
		// Car Selling Price Card
		{
			description: "Car Selling Price Overview",
			icon: DollarSign,
			value: (
				<>
					<span
						className={`${safeData.totalSellingPriceDiff >= 0 ? "text-green-500" : "text-red-500"}`}
					>
						{isLakhs(safeData.totalSellingPriceCurrent)
							? formatLakhs(safeData.totalSellingPriceCurrent)
							: safeData.totalSellingPriceCurrent}
					</span>{" "}
					<span className="text-xl text-muted-foreground">
						{isLakhs(safeData.totalSellingPriceCurrent) ? "lakhs" : "Ks"}
					</span>
				</>
			),
			badge: (
				<Badge variant="outline">
					{safeData.totalSellingPriceDiff >= 0 ? (
						<TrendingUp className="text-green-500" />
					) : (
						<TrendingDown className="text-red-500" />
					)}
					{safeData.totalSellingPriceDiff >= 0 ? "+" : "-"}
					{isLakhs(Math.abs(safeData.totalSellingPriceDiff))
						? `${formatLakhs(Math.abs(safeData.totalSellingPriceDiff))} lakhs`
						: `${Math.abs(safeData.totalSellingPriceDiff)} Ks`}
				</Badge>
			),
			footerTitle: (
				<>
					{safeData.totalSellingPriceDiff >= 0
						? `Up ${
								isLakhs(Math.abs(safeData.totalSellingPriceDiff))
									? `${formatLakhs(Math.abs(safeData.totalSellingPriceDiff))} lakhs`
									: `${Math.abs(safeData.totalSellingPriceDiff)} Ks`
							} this month`
						: `Down ${
								isLakhs(Math.abs(safeData.totalSellingPriceDiff))
									? `${formatLakhs(Math.abs(safeData.totalSellingPriceDiff))} lakhs`
									: `${Math.abs(safeData.totalSellingPriceDiff)} Ks`
							} this month`}{" "}
					{safeData.totalSellingPriceDiff >= 0 ? (
						<TrendingUp className="size-4 text-green-500" />
					) : (
						<TrendingDown className="size-4 text-red-500" />
					)}
				</>
			),
			footerSubtitle: "Total car selling price this month",
		},
		// Total Car Purchased Price Card
		{
			description: "Car Purchased Price Overview",
			icon: BanknoteArrowUp,
			value: (
				<>
					<span
						className={`${safeData.totalPurchasedPriceDiff >= 0 ? "text-green-500" : "text-red-500"}`}
					>
						{isLakhs(safeData.totalPurchasedPriceCurrent)
							? formatLakhs(safeData.totalPurchasedPriceCurrent)
							: safeData.totalPurchasedPriceCurrent}
					</span>{" "}
					<span className="text-xl text-muted-foreground">
						{isLakhs(safeData.totalPurchasedPriceCurrent) ? "lakhs" : "Ks"}
					</span>
				</>
			),
			badge: (
				<Badge variant="outline">
					{safeData.totalPurchasedPriceDiff >= 0 ? (
						<TrendingUp className="text-green-500" />
					) : (
						<TrendingDown className="text-red-500" />
					)}
					{safeData.totalPurchasedPriceDiff >= 0 ? "+" : "-"}
					{isLakhs(Math.abs(safeData.totalPurchasedPriceDiff))
						? `${formatLakhs(Math.abs(safeData.totalPurchasedPriceDiff))} lakhs`
						: `${Math.abs(safeData.totalPurchasedPriceDiff)} Ks`}
				</Badge>
			),
			footerTitle: (
				<>
					{safeData.totalPurchasedPriceDiff >= 0
						? "Good financial performance"
						: "Needs cost optimization"}{" "}
					{safeData.totalPurchasedPriceDiff >= 0 ? (
						<TrendingUp className="size-4 text-green-500" />
					) : (
						<TrendingDown className="size-4 text-red-500" />
					)}
				</>
			),
			footerSubtitle: "Total car purchased price this month",
		},
	];

	return (
		<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
			{cards.map((card) => (
				<DashboardCard
					key={card.description}
					description={card.description}
					icon={card.icon}
					value={card.value}
					badge={card.badge}
					footerTitle={card.footerTitle}
					footerSubtitle={card.footerSubtitle}
				/>
			))}
		</div>
	);
}
