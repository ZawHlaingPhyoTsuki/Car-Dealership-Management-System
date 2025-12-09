"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeSwitcher } from "./mode-switcher";

export function SiteHeader() {
	const pathname = usePathname();

	// Function to get the header title based on the current path
	const getHeaderTitle = () => {
		if (pathname === "/dashboard") {
			return "Dashboard";
		} else if (pathname.startsWith("/dashboard/cars")) {
			return "Cars Management";
		} else if (pathname.startsWith("/dashboard/expenses")) {
			return "Expenses Management";
		} else if (pathname.startsWith("/dashboard/employees")) {
			return "Employees Management";
		} else if (pathname.startsWith("/dashboard/analytics")) {
			return "Analytics";
		} else if (pathname.startsWith("/dashboard/account")) {
			return "Account Settings";
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
