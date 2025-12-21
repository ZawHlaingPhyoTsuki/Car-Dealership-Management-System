import type { ColumnDef } from "@tanstack/react-table";
import { formatNumberSafe } from "@/lib/utils";
import type { CarProfitSummary } from "../actions/get-car-profit";

export const columns: ColumnDef<CarProfitSummary>[] = [
	{
		accessorKey: "month",
		header: () => <span className="text-lg">Month</span>,
		cell: ({ row }) => {
			return <span className="font-medium text-lg">{row.original.month}</span>;
		},
	},
	{
		accessorKey: "carsSold",
		header: () => <div className="text-lg text-right">Cars Sold</div>,
		cell: ({ row }) => {
			const carsSold = row.original.carsSold;
			return <div className="text-right font-medium text-lg">{carsSold}</div>;
		},
	},
	{
		accessorKey: "totalSellingPrice",
		header: () => <div className="text-lg text-right">Total Selling Price</div>,
		cell: ({ row }) => {
			const revenue = row.original.totalSellingPrice;
			return (
				<div className="text-right font-medium text-lg text-green-600">
					{formatNumberSafe(revenue)} Ks
				</div>
			);
		},
	},
];
