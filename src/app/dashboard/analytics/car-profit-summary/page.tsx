import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import ContentWrapper from "@/components/shared/content-wrapper";
import CarProfitTable from "@/features-v2/analytics-car-profit/components/car-profit-table";
import { getCarProfitSummaryQueryOptions } from "@/features-v2/analytics-car-profit/queries/use-car-profit";

export const metadata: Metadata = {
	title: "Car Profit Summary",
	description: "Business car profit summary dashboard",
};

export default async function CarProfitSummaryPage() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery(getCarProfitSummaryQueryOptions);

	return (
		<ContentWrapper
			title="Monthly Car Profit Summary"
			description="Overview of monthly car sales"
		>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<CarProfitTable />
			</HydrationBoundary>
		</ContentWrapper>
	);
}
