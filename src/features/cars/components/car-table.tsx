"use client";

import TableError from "@/components/errors/table-error";
import DataTable from "@/components/shared/data-table";
import TableLoading from "@/components/shared/table-loading";
import { useGetCars } from "../queries/use-cars";
import { columns } from "./columns";

export default function CarTable() {
	const { data: cars = [], isLoading, error, refetch } = useGetCars();

	if (isLoading) return <TableLoading label="Getting Cars..." />;
	if (error) return <TableError label={"cars"} onRetry={refetch} />;

	return <DataTable columns={columns} data={cars} />;
}
