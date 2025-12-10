"use client";

import {
	IconCalendarDollar,
	IconChartBar,
	IconDashboard,
	IconListDetails,
	IconSettings,
	IconUsers,
} from "@tabler/icons-react";
import type { User } from "better-auth";
import Image from "next/image";
import Link from "next/link";
import type * as React from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "@/components/ui/sidebar";
import { paths } from "@/config/paths";

const data = {
	navMain: [
		{
			title: "Dashboard",
			url: paths.dashboard.root.getHref(),
			icon: IconDashboard,
		},
		{
			title: "Car Listings",
			url: paths.dashboard.cars.getHref(),
			icon: IconListDetails,
		},
		{
			title: "Expenses",
			url: paths.dashboard.expenses.getHref(),
			icon: IconCalendarDollar,
		},
		{
			title: "Employees",
			url: paths.dashboard.employees.getHref(),
			icon: IconUsers,
		},
		{
			title: "Analytics",
			url: paths.dashboard.analytics.getHref(),
			icon: IconChartBar,
		},
		{
			title: "Settings",
			url: paths.dashboard.settings.getHref(),
			icon: IconSettings,
		},
	],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	user: User;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<Link href={"/dashboard"} className="flex items-center gap-3">
					<Image
						src="/images/logo.jpg"
						height={50}
						width={50}
						alt={"7hr Logo"}
						className="rounded-full overflow-hidden"
					/>
					<p className="text-xl font-semibold">7hrs Automobile</p>
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}
