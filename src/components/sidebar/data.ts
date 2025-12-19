import {
	Car,
	ChartColumn,
	FileSpreadsheet,
	HandCoins,
	LayoutDashboard,
	Users,
} from "lucide-react";
import { paths } from "@/config/paths";
import type { NavItem } from "./nav-main";

export const navigationTitle = {
	Dashboard: "Dashboard",

	CarsListing: "Cars Listing",
	CarSharersManagement: "Car Sharers Management",
	Expenses: "Expenses",
	Employees: "Employees",

	// Analytics pages
	Analytics: "Analytics",
	AnalyticsAvailableCars: "Available Cars",
	AnalyticsSoldCars: "Sold Cars",
	AnalyticsCarProfitSummary: "Car Profit Summary",
	// AnalyticsSharersTotal: "Sharers Total",

	Account: "Account",
};

export const data: {
	navMain: NavItem[];
} = {
	navMain: [
		{
			title: navigationTitle.Expenses,
			url: paths.dashboard.expenses.getHref(),
			icon: FileSpreadsheet,
		},

		{
			title: navigationTitle.Employees,
			url: paths.dashboard.employees.getHref(),
			icon: Users,
		},

		{
			title: navigationTitle.CarSharersManagement,
			url: paths.dashboard.carSharers.getHref(),
			icon: HandCoins,
		},
		{
			title: navigationTitle.CarsListing,
			url: paths.dashboard.cars.getHref(),
			icon: Car,
		},
		{
			title: navigationTitle.Analytics,
			url: "",
			icon: ChartColumn,
			items: [
				{
					title: navigationTitle.AnalyticsCarProfitSummary,
					url: paths.dashboard.analytics.carProfitSummary.getHref(),
				},
				{
					title: navigationTitle.AnalyticsAvailableCars,
					url: paths.dashboard.analytics.availableCars.getHref(),
				},
				{
					title: navigationTitle.AnalyticsSoldCars,
					url: paths.dashboard.analytics.soldCars.getHref(),
				},

				// {
				// 	title: navigationTitle.AnalyticsSharersTotal,
				// 	url: paths.dashboard.analytics.sharersTotal.getHref(),
				// },
			],
		},
		{
			title: navigationTitle.Dashboard,
			url: paths.dashboard.root.getHref(),
			icon: LayoutDashboard,
		},
	],
};

export const titleMap = [
	// ------------------------
	// ANALYTICS SUB-PAGES
	// ------------------------
	{
		match: paths.dashboard.analytics.availableCars.getHref(),
		title: navigationTitle.AnalyticsAvailableCars,
	},
	{
		match: paths.dashboard.analytics.soldCars.getHref(),
		title: navigationTitle.AnalyticsSoldCars,
	},
	{
		match: paths.dashboard.analytics.carProfitSummary.getHref(),
		title: navigationTitle.AnalyticsCarProfitSummary,
	},
	// {
	// 	match: paths.dashboard.analytics.sharersTotal.getHref(),
	// 	title: navigationTitle.AnalyticsSharersTotal,
	// },

	// ------------------------
	// MAIN PAGES (lower priority)
	// ------------------------
	{
		match: paths.dashboard.cars.getHref(),
		title: navigationTitle.CarsListing,
	},
	{
		match: paths.dashboard.carSharers.getHref(),
		title: navigationTitle.CarSharersManagement,
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
		match: paths.dashboard.account.getHref(),
		title: navigationTitle.Account,
	},
];
