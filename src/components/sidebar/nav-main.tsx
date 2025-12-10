"use client";

import type { Icon } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

type NavMainItem = {
	title: string;
	url: string;
	icon?: Icon;
};

export function NavMain({ items }: { items: NavMainItem[] }) {
	const pathname = usePathname();
	const router = useRouter();
	const { setOpenMobile } = useSidebar();

	const isActive = (url: string) => {
		if (url === "/dashboard") {
			return pathname === "/dashboard";
		}

		return (
			(pathname === url || pathname.startsWith(`${url}/`)) &&
			url !== "/dashboard"
		);
	};

	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col">
				<SidebarMenu className="">
					{items.map((item) => (
						<SidebarMenuItem key={item.url}>
							<SidebarMenuButton
								className="cursor-pointer"
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
