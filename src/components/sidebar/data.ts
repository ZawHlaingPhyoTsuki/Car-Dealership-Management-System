import {
	Car,
	ChartColumn,
	CircleQuestionMark,
	FileSpreadsheet,
	LayoutDashboard,
	Settings,
	Users,
} from "lucide-react";
import { paths } from "@/config/paths";
import type { NavItem } from "./nav-main";

export const navigationTitle = {
	Dashboard: "Dashboard",

	CarsListing: "Cars Listing",
	Expenses: "Expenses",
	Employees: "Employees",

	// Analytics pages
	Analytics: "Analytics",
	AnalyticsOverview: "Overview",
	AnalyticsAvailableCars: "Available Cars",
	AnalyticsSoldCars: "Sold Cars",
	AnalyticsSoldCars2: "Sold Cars 2",
	AnalyticsCarCosts: "Car Costs",
	AnalyticsExpenseCategories: "Expense Categories",
	AnalyticsCarProfitSummary: "Car Profit Summary",
	AnalyticsSharersProfit: "Sharers Profit",
	AnalyticsSharersHistory: "Sharers History",
	AnalyticsSharersTotal: "Sharers Total",

	Account: "Account",
	GetHelp: "Get Help",
};

export const data: {
	navMain: NavItem[];
	navSecondary: NavItem[];
} = {
	navMain: [
		{
			title: navigationTitle.Dashboard,
			url: paths.dashboard.root.getHref(),
			icon: LayoutDashboard,
		},
		{
			title: navigationTitle.CarsListing,
			url: paths.dashboard.cars.getHref(),
			icon: Car,
		},
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
			title: navigationTitle.Analytics,
			url: "",
			icon: ChartColumn,
			items: [
				{
					title: navigationTitle.AnalyticsOverview,
					url: paths.dashboard.analytics.overview.getHref(),
				},
				{
					title: navigationTitle.AnalyticsAvailableCars,
					url: paths.dashboard.analytics.availableCars.getHref(),
				},
				{
					title: navigationTitle.AnalyticsSoldCars,
					url: paths.dashboard.analytics.soldCars.getHref(),
				},
				{
					title: navigationTitle.AnalyticsExpenseCategories,
					url: paths.dashboard.analytics.expenseCategories.getHref(),
				},
				{
					title: navigationTitle.AnalyticsCarProfitSummary,
					url: paths.dashboard.analytics.carProfitSummary.getHref(),
				},
				{
					title: navigationTitle.AnalyticsSharersTotal,
					url: paths.dashboard.analytics.sharersTotal.getHref(),
				},
			],
		},
	],
	navSecondary: [
		{
			title: navigationTitle.Account,
			url: paths.dashboard.account.getHref(),
			icon: Settings,
		},
		{
			title: navigationTitle.GetHelp,
			url: paths.dashboard.help.getHref(),
			icon: CircleQuestionMark,
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
		match: paths.dashboard.analytics.expenseCategories.getHref(),
		title: navigationTitle.AnalyticsExpenseCategories,
	},
	{
		match: paths.dashboard.analytics.carProfitSummary.getHref(),
		title: navigationTitle.AnalyticsCarProfitSummary,
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
		match: paths.dashboard.account.getHref(),
		title: navigationTitle.Account,
	},
	{ match: paths.dashboard.help.getHref(), title: navigationTitle.GetHelp },
];
