import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import ContentWrapper from "@/components/shared/content-wrapper";
import CarSoldTable from "@/features/analytics-car-sold/components/car-sold-table";
import { getCarsSoldQueryOptions } from "@/features/analytics-car-sold/queries/use-car-sold";

export const metadata: Metadata = {
	title: "Sold Cars Analytics",
	description: "Business car profits dashboard",
};

export default async function Page() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery(getCarsSoldQueryOptions);

	return (
		<ContentWrapper
			title="Sold Cars Analytics"
			description="Overview of monthly car sales"
		>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<CarSoldTable />
			</HydrationBoundary>
		</ContentWrapper>
	);
}
