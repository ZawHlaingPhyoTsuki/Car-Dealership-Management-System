"use client";

import {
	IconChartBar,
	IconDashboard,
	IconFolder,
	IconHelp,
	IconInnerShadowTop,
	IconListDetails,
	IconSearch,
	IconSettings,
	IconUsers,
} from "@tabler/icons-react";
import type * as React from "react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { paths } from "@/config/paths";

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "https://github.com/shadcn.png",
	},
	navMain: [
		{
			title: "Dashboard",
			url: paths.dashboard.root.getHref(),
			icon: IconDashboard,
		},
		{
			title: "Cars Management",
			url: paths.dashboard.cars.getHref(),
			icon: IconListDetails,
		},
		{
			title: "Expenses Management",
			url: paths.dashboard.expenses.getHref(),
			icon: IconFolder,
		},
		{
			title: "Employees Management",
			url: paths.dashboard.employees.getHref(),
			icon: IconUsers,
		},
		{
			title: "Analytics",
			url: paths.dashboard.analytics.getHref(),
			icon: IconChartBar,
		},
	],
	navSecondary: [
		{
			title: "Settings",
			url: "#",
			icon: IconSettings,
		},
		{
			title: "Get Help",
			url: "#",
			icon: IconHelp,
		},
		{
			title: "Search",
			url: "#",
			icon: IconSearch,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							{/* TODO: Replace with your logo and link */}
							<div>
								<IconInnerShadowTop className="!size-5" />
								<span className="text-base font-semibold">Acme Inc.</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
