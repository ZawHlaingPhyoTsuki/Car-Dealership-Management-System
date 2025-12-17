import type { ColumnDef } from "@tanstack/react-table";
import type { CarProfitSummary } from "../actions/get-car-profit";

export const columns: ColumnDef<CarProfitSummary>[] = [
	{
		accessorKey: "month",
		header: "Month",
		cell: ({ row }) => {
			return <span className="font-medium">{row.original.month}</span>;
		},
	},
	{
		accessorKey: "carsSold",
		header: () => <div className="text-right">Cars Sold</div>,
		cell: ({ row }) => {
			const carsSold = row.original.carsSold;
			return <div className="text-right font-medium">{carsSold}</div>;
		},
	},
	{
		accessorKey: "totalProfit",
		header: () => <div className="text-right">Total Profit</div>,
		cell: ({ row }) => {
			const profit = row.original.totalProfit;
			return (
				<div className="text-right font-bold text-green-600">
					{profit.toLocaleString()} THB
				</div>
			);
		},
	},
];
