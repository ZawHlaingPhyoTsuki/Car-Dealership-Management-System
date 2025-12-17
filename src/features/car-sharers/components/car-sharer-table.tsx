"use client";

import DataTable from "@/components/shared/data-table";
import { useGetCars } from "@/features/cars/queries/use-cars";
import { columns } from "./columns";

export default function CarSharerTable() {
	const { data: cars = [], isLoading } = useGetCars();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return <DataTable columns={columns} data={cars} />;
}
