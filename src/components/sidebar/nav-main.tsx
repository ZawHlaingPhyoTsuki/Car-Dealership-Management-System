"use client";

import type { Icon } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: Icon;
	}[];
}) {
	const pathname = usePathname();
	const router = useRouter();
	const { setOpenMobile } = useSidebar();

	const isActive = (url: string) => {
		// Exact match for root dashboard
		if (url === "/dashboard") {
			return pathname === "/dashboard";
		}
		// For nested routes, check if pathname starts with the url
		return pathname.startsWith(url) && url !== "/dashboard";
	};

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Modules</SidebarGroupLabel>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								tooltip={item.title}
								isActive={isActive(item.url)}
								size="lg"
								onClick={() => {
									setOpenMobile(false);
									router.push(item.url);
								}}
							>
								{item.icon && <item.icon />}
								<span>{item.title}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
