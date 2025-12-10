"use client";

import { BanknoteArrowDown, CarFront, CircleDollarSign } from "lucide-react";
import DbdCard from "@/components/dashboard/DbdCard";
import { Skeleton } from "@/components/ui/skeleton";
import { paths } from "@/config/paths";

export default function DashboardPage() {
	return (
		<div className="p-2 md:p-4 space-y-4">
			<h1 className="text-xl font-bold text-slate-700 dark:text-slate-200">
				Welcome Admin
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
				<DbdCard
					icon={CarFront}
					title={"Sale Cars List"}
					amount={"100"}
					plus={true}
					numColor={"text-green-500"}
					url={paths.dashboard.cars.getHref()}
				/>
				<DbdCard
					icon={CircleDollarSign}
					title={"Profit Overview"}
					amount={"350000K"}
					plus={true}
					url={paths.dashboard.analytics.getHref()}
				/>
				<DbdCard
					icon={BanknoteArrowDown}
					title={"Total Expenses"}
					amount={"2500K"}
					plus={false}
					url={paths.dashboard.expenses.getHref()}
				/>
			</div>
			<div className="space-y-2">
				<Skeleton key={1} className="h-12 w-full" />
				<Skeleton key={2} className="h-12 w-full" />
				<Skeleton key={3} className="h-12 w-full" />
				<Skeleton key={4} className="h-12 w-full" />
			</div>
		</div>
	);
}
