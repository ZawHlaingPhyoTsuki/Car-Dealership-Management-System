"use client";

import { MainErrorFallback } from "@/components/errors/main";
import DataTable from "@/components/shared/data-table";
import LoadingTable from "@/components/shared/loading-table";
import { useGetCars } from "@/features/cars/queries/use-cars";
import { columns } from "./columns";

export default function CarSharerTable() {
	const { data: cars = [], isLoading, error } = useGetCars();

	if (isLoading) return <LoadingTable label="Getting Cars..." />;
	if (error) return <MainErrorFallback />;

	return <DataTable columns={columns} data={cars} />;
}
