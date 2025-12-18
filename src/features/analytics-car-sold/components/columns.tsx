import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { formatAmountInLakhs } from "@/lib/utils";
import type { SoldCar } from "../actions/get-car-sold";
import { monthYearFilter } from "./filterFn";

export const columns: ColumnDef<SoldCar>[] = [
	{ accessorKey: "name", header: "Car Name" },
	{
		accessorKey: "salePrice",
		header: "Sale Price (lakhs)",
		cell: ({ row }) => formatAmountInLakhs(row.original.salePrice),
	},
	{
		accessorKey: "sharer",
		header: "Sharer",
		cell: ({ row }) => row.original.sharer ?? "_",
	},
	{
		accessorKey: "commissionPct",
		header: "Commission (%)",
		cell: ({ row }) =>
			row.original.commissionPct !== 0 && !!row.original.sharer
				? `${row.original.commissionPct} %`
				: "_",
	},
	{
		accessorKey: "commission",
		header: "Commission (lakhs)",
		cell: ({ row }) =>
			row.original.commission &&
			row.original.commissionPct !== 0 &&
			!!row.original.sharer
				? formatAmountInLakhs(row.original.commission)
				: "_",
	},
	{
		accessorKey: "companyRevenue",
		header: "Company Revenue (lakhs)",
		cell: ({ row }) => formatAmountInLakhs(row.original.companyRevenue),
	},
	{
		accessorKey: "soldDate",
		filterFn: monthYearFilter,
		header: "Sold Date",
		cell: ({ row }) => {
			const date = row.getValue("soldDate") as Date;
			if (!date) return "_";
			return format(date, "dd/MM/yyyy");
		},
	},
];
