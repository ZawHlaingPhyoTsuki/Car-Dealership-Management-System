"use client";

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
import { data } from "./data";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	user: User;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<Link
					href={paths.dashboard.root.getHref()}
					className="flex items-center gap-2 font-semibold text-xl"
				>
					<Image
						src="/images/logo.jpg"
						width={40}
						height={40}
						className="rounded-full"
						alt="7hrs Automobile Logo"
						priority
					/>
					7hrs Automobile
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
