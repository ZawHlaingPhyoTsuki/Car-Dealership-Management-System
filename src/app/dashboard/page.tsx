import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import DashboardCards from "@/features-v2/dashboard/components/dashboard-cards";
import { getDashboardQueryOptions } from "@/features-v2/dashboard/queries/use-dashboard";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Business dashboard",
};

export default async function DashboardPage() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery(getDashboardQueryOptions);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<DashboardCards />
		</HydrationBoundary>
	);
}
