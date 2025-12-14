import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import ContentWrapper from "@/components/shared/content-wrapper";
import CarSharerTable from "@/features/car-sharers/components/car-sharer-table";
import { getCarsQueryOptions } from "@/features/cars/queries/use-cars";

export default async function Page() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery(getCarsQueryOptions);

	return (
		<ContentWrapper
			title="Car Sharer Management"
			description="Manage your car sharers and their information"
		>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<CarSharerTable />
			</HydrationBoundary>
		</ContentWrapper>
	);
}
