import {
	Car,
	ChartColumn,
	CircleQuestionMark,
	FileSpreadsheet,
	LayoutDashboard,
	Search,
	Settings,
	UserPlus,
	Users,
} from "lucide-react";
import { paths } from "@/config/paths";

export const data = {
	navMain: [
		{
			title: "Dashboard",
			url: paths.dashboard.root.getHref(),
			icon: LayoutDashboard,
		},
		{
			title: "Cars Management",
			url: paths.dashboard.cars.getHref(),
			icon: Car,
		},
		{
			title: "Expenses Management",
			url: paths.dashboard.expenses.getHref(),
			icon: FileSpreadsheet,
		},
		{
			title: "Employees Management",
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
			title: "Settings",
			url: "#",
			icon: Settings,
		},
		{
			title: "Get Help",
			url: "#",
			icon: CircleQuestionMark,
		},
		{
			title: "Search",
			url: "#",
			icon: Search,
		},
	],
};
