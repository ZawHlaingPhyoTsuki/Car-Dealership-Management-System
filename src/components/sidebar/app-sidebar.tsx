'use client';

import type { User } from 'better-auth';
import type * as React from 'react';
import { NavMain } from '@/components/sidebar/nav-main';
import { NavSecondary } from '@/components/sidebar/nav-secondary';
import { NavUser } from '@/components/sidebar/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';
import { data } from './data';
import Link from 'next/link';
import Image from 'next/image';
import { paths } from '@/config/paths';

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
                        className="rounded-full overflow-hidden"
                        alt="Logo"
                    />
                    7hrs Automobile
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
