"use client";

import TableError from "@/components/errors/table-error";
import DataTable from "@/components/shared/data-table";
import TableLoading from "@/components/shared/table-loading";
import { useGetCars } from "@/features/cars/queries/use-cars";
import { columns } from "./columns";

export default function CarSharerTable() {
	const { data: cars = [], isLoading, error, refetch } = useGetCars();

	if (isLoading) return <TableLoading label="Getting Car Sharers..." />;
	if (error) return <TableError label={"car sharers"} onRetry={refetch} />;

	return <DataTable columns={columns} data={cars} />;
}
