import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import ContentWrapper from "@/components/shared/content-wrapper";
import AddCarSharerDialog from "@/features/car-sharers/components/add-car-sharer-dialog";
import CarSharerTable from "@/features/car-sharers/components/car-sharer-table";
import AddCarDialog from "@/features/cars/components/add-car-dialog";
import { getCarsQueryOptions } from "@/features/cars/queries/use-cars";

export default async function Page() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery(getCarsQueryOptions);

	return (
		<ContentWrapper
			title="Car Sharer Management"
			description="Manage your car sharers and their information"
			addButton={
				<div className="flex flex-col md:flex-row justify-end gap-2">
					<AddCarSharerDialog />
					<AddCarDialog />
				</div>
			}
		>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<CarSharerTable />
			</HydrationBoundary>
		</ContentWrapper>
	);
}
