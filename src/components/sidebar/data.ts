import type { LucideIcon } from "lucide-react";
import {
	Car,
	ChartColumn,
	CircleQuestionMark,
	FileSpreadsheet,
	LayoutDashboard,
	Settings,
	UserPlus,
	Users,
} from "lucide-react";
import { paths } from "@/config/paths";

export const navigationTitle = {
	Dashboard: "Dashboard",

	CarsListing: "Cars Listing",
	Expenses: "Expenses",
	Employees: "Employees",

	// Analytics pages
	Analytics: "Analytics",
	AnalyticsAvailableCars: "Available Cars",
	AnalyticsSoldCars: "Sold Cars",
	AnalyticsSoldCars2: "Sold Cars 2",
	AnalyticsCarCosts: "Car Costs",
	AnalyticsExpenseCategories: "Expense Categories",
	AnalyticsProfitSummary: "Profit Summary",

	AccountCreation: "Account Creation",
	Account: "Account",
	GetHelp: "Get Help",
};

type NavItem = {
	title: string;
	url: string;
	icon: LucideIcon;
};

export const data: {
	navMain: (NavItem & {
		items?: {
			title: string;
			url: string;
		}[];
	})[];
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
			url: paths.dashboard.analytics.getHref(),
			icon: ChartColumn,
			items: [
				{
					title: "Available Cars",
					url: paths.dashboard.analytics.availableCars.getHref(),
				},
				{
					title: "Sold Cars",
					url: paths.dashboard.analytics.soldCars.getHref(),
				},
				{
					title: "Sold Cars (2)",
					url: paths.dashboard.analytics.soldCars2.getHref(),
				},
				{
					title: "Car Costs",
					url: paths.dashboard.analytics.carCosts.getHref(),
				},
				{
					title: "Expense Categories",
					url: paths.dashboard.analytics.expenseCategories.getHref(),
				},
				{
					title: "Profit Summary",
					url: paths.dashboard.analytics.profitSummary.getHref(),
				},
			],
		},
		{
			title: navigationTitle.AccountCreation,
			url: paths.dashboard.newAccount.getHref(),
			icon: UserPlus,
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
