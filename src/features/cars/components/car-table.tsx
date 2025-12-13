"use client";

import DataTable from "@/components/shared/data-table";
import { useGetCars } from "../queries/use-get-cars";
import { columns } from "./columns";

export default function CarTable() {
	const { data: cars, isLoading } = useGetCars();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return <DataTable columns={columns} data={cars ?? []} />;
}
