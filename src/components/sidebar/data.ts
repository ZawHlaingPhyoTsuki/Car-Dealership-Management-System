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

type NavItem = {
	title: string;
	url: string;
	icon: LucideIcon;
};

export const data: {
	navMain: NavItem[];
	navSecondary: NavItem[];
} = {
	navMain: [
		{
			title: "Dashboard",
			url: paths.dashboard.root.getHref(),
			icon: LayoutDashboard,
		},
		{
			title: "Cars Listing",
			url: paths.dashboard.cars.getHref(),
			icon: Car,
		},
		{
			title: "Expenses",
			url: paths.dashboard.expenses.getHref(),
			icon: FileSpreadsheet,
		},
		{
			title: "Employees",
			url: paths.dashboard.employees.getHref(),
			icon: Users,
		},
		{
			title: "Analytics",
			url: paths.dashboard.analytics.getHref(),
			icon: ChartColumn,
		},
		{
			title: "Account Creation",
			url: paths.dashboard.newAccount.getHref(),
			icon: UserPlus,
		},
	],
	navSecondary: [
		{
			title: "Account",
			url: paths.dashboard.account.getHref(),
			icon: Settings,
		},
		{
			title: "Get Help",
			url: paths.dashboard.help.getHref(),
			icon: CircleQuestionMark,
		},
	],
};
