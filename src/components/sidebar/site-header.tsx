"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { paths } from "@/config/paths";
import { ModeSwitcher } from "./mode-switcher";

export function SiteHeader() {
	const pathname = usePathname();

	// Function to get the header title based on the current path
	const getHeaderTitle = () => {
		if (pathname === paths.dashboard.root.getHref()) {
			return "Dashboard";
		} else if (pathname.startsWith(paths.dashboard.cars.getHref())) {
			return "Cars Management";
		} else if (pathname.startsWith(paths.dashboard.expenses.getHref())) {
			return "Expenses Management";
		} else if (pathname.startsWith(paths.dashboard.employees.getHref())) {
			return "Employees Management";
		} else if (pathname.startsWith(paths.dashboard.analytics.getHref())) {
			return "Analytics";
		} else if (pathname.startsWith(paths.dashboard.account.getHref())) {
			return "Account Settings";
		} else if (pathname.startsWith(paths.dashboard.newAccount.getHref())) {
			return "New Account";
		} else {
			return "Dashboard"; // Fallback title
		}
	};

	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center gap-1 pl-4 pr-2 lg:gap-2 lg:pl-6 lg:pr-4">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>
				<h1 className="text-base font-medium">{getHeaderTitle()}</h1>
				<div className="ml-auto flex items-center gap-2">
					<ModeSwitcher />
				</div>
			</div>
		</header>
	);
}
