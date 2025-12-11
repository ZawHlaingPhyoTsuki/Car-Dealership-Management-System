"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export type NavItem = {
	title: string;
	url: string;
	icon?: LucideIcon;
	items?: { title: string; url: string }[];
};

export function NavMain({ items }: { items: NavItem[] }) {
	const pathname = usePathname();
	const router = useRouter();

	const handleNavigation = (url: string) => {
		router.push(url);
	};

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Menu</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					const hasSub = item.items && item.items.length > 0;

					// parent is active ONLY when exact path
					const isActiveParent = pathname === item.url;

					// Auto-open collapsible if any sub matches
					const isAnySubActive = hasSub
						? item.items?.some((sub) => pathname.startsWith(sub.url))
						: false;

					if (!hasSub) {
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									isActive={isActiveParent}
									onClick={() => handleNavigation(item.url)}
									className="w-full text-left"
								>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					}

					return (
						<Collapsible
							key={item.title}
							asChild
							defaultOpen={isAnySubActive}
							className="group/collapsible"
						>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton isActive={isActiveParent}>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
										<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
									</SidebarMenuButton>
								</CollapsibleTrigger>

								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items?.map((sub) => {
											// sub active when exact OR deeper nested
											const isSubActive =
												pathname === sub.url ||
												pathname.startsWith(`${sub.url}/`);

											return (
												<SidebarMenuSubItem key={sub.title}>
													<SidebarMenuSubButton
														asChild
														isActive={isSubActive}
														onClick={() => handleNavigation(sub.url)}
														className="w-full text-left"
													>
														<span>{sub.title}</span>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											);
										})}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
