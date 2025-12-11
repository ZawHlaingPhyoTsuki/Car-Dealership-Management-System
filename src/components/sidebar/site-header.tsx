"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { paths } from "@/config/paths";
import { navigationTitle } from "./data";
import { ModeSwitcher } from "./mode-switcher";

export function SiteHeader() {
	const pathname = usePathname();

	const titleMap = [
		// ------------------------
		// ANALYTICS SUB-PAGES
		// ------------------------
		{
			match: paths.dashboard.analytics.availableCars.getHref(),
			title: navigationTitle.AnalyticsAvailableCars,
		},
		{
			match: paths.dashboard.analytics.soldCars2.getHref(),
			title: navigationTitle.AnalyticsSoldCars2,
		},
		{
			match: paths.dashboard.analytics.soldCars.getHref(),
			title: navigationTitle.AnalyticsSoldCars,
		},
		{
			match: paths.dashboard.analytics.carCosts.getHref(),
			title: navigationTitle.AnalyticsCarCosts,
		},
		{
			match: paths.dashboard.analytics.expenseCategories.getHref(),
			title: navigationTitle.AnalyticsExpenseCategories,
		},
		{
			match: paths.dashboard.analytics.profitSummary.getHref(),
			title: navigationTitle.AnalyticsProfitSummary,
		},

		// ------------------------
		// MAIN PAGES (lower priority)
		// ------------------------
		{
			match: paths.dashboard.analytics.overview.getHref(),
			title: navigationTitle.AnalyticsOverview,
		},
		{
			match: paths.dashboard.cars.getHref(),
			title: navigationTitle.CarsListing,
		},
		{
			match: paths.dashboard.expenses.getHref(),
			title: navigationTitle.Expenses,
		},
		{
			match: paths.dashboard.employees.getHref(),
			title: navigationTitle.Employees,
		},
		{
			match: paths.dashboard.newAccount.getHref(),
			title: navigationTitle.AccountCreation,
		},
		{
			match: paths.dashboard.account.getHref(),
			title: navigationTitle.Account,
		},
		{ match: paths.dashboard.help.getHref(), title: navigationTitle.GetHelp },
	];

	const activeTitle =
		titleMap.find((m) => pathname.startsWith(m.match))?.title ??
		navigationTitle.Dashboard;

	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center gap-1 pl-4 pr-2 lg:gap-2 lg:pl-6 lg:pr-4">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>
				<h1 className="text-base font-medium">{activeTitle}</h1>
				<div className="ml-auto flex items-center gap-2">
					<ModeSwitcher />
				</div>
			</div>
		</header>
	);
}
