import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import ContentWrapper from "@/components/shared/content-wrapper";
import AddCarDialog from "@/features/cars/components/add-car-dialog";
import CarTable from "@/features/cars/components/car-table";
import { getCarsQueryOptions } from "@/features/cars/queries/use-cars";

export default async function Page() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery(getCarsQueryOptions);

	return (
		<ContentWrapper
			title="Car Management"
			description="Manage your cars and their information"
			addButton={<AddCarDialog />}
		>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<CarTable />
			</HydrationBoundary>
		</ContentWrapper>
	);
}
