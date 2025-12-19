"use client";

import type { User } from "better-auth";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type * as React from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "@/components/ui/sidebar";
import { paths } from "@/config/paths";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { data } from "./data";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	user: User;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
	const router = useRouter();

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
				<div className="flex items-center opacity-80 mb-6">
					<Image
						alt="Banana Coder Avatar"
						src="/images/banana-coder.jpg"
						height={40}
						width={40}
						className="object-cover rounded-full"
					/>
					<div>
						<span className="text-xs text-muted-foreground">powered by</span>
						<p className="-mt-1 font-serif">
							Banana Coder <sup className="text-muted-foreground">&copy;</sup>
						</p>
					</div>
				</div>
				<Button
					variant="outline"
					onClick={() =>
						authClient.signOut({
							fetchOptions: {
								onSuccess: () => {
									router.replace(paths.login.getHref());
								},
							},
						})
					}
				>
					<LogOut />
					Logout
				</Button>
			</SidebarFooter>
		</Sidebar>
	);
}
