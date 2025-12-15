"use client";

import DataTable from "@/components/shared/data-table";
import LoadingTable from "@/components/shared/loading-table";
import { useGetCars } from "@/features/cars/queries/use-cars";
import { columns } from "./columns";

export default function CarSharerTable() {
	const { data: cars, isLoading, isError } = useGetCars();

	if (isLoading) return <LoadingTable label="Getting Sharers..." />;
	if (isError) return <div>Error while loading!</div>;

	return <DataTable columns={columns} data={cars ?? []} />;
}
