"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/data-table-column-header";
import { Label } from "@/components/ui/label";
import type { Car } from "@/features/cars/actions/get-cars";
import { CarActions } from "@/features/cars/components/car-actions";
import { formatNumberSafe } from "@/lib/utils";

export const columns: ColumnDef<Car>[] = [
	{
		id: "no",
		header: () => <Label className="text-lg">No.</Label>,
		cell: ({ row, table }) => {
			const { pageIndex, pageSize } = table.getState().pagination;
			const filteredRows = table.getFilteredRowModel().rows;
			const rowIndex = filteredRows.findIndex(
				(filteredRow) => filteredRow.id === row.id,
			);
			return pageIndex * pageSize + rowIndex + 1;
		},
	},
	{
		accessorKey: "name",
		header: () => <Label className="text-lg">Car Name</Label>,
		cell: ({ row }) => {
			const car = row.original;

			return (
				<div className="min-w-0">
					<div
						className={`font-medium truncate ${car.shareholderId ? "text-amber-500" : "text-green-500"}`}
					>
						{car.name}
					</div>

					{car.licenseNumber && (
						<div className="text-sm text-gray-500 truncate">
							{car.licenseNumber}
						</div>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "purchasedPrice",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Purchased Price" />
		),
		cell: ({ row }) => {
			const purchasedPrice = row.getValue<number>("purchasedPrice");
			return formatNumberSafe(purchasedPrice);
		},
	},
	{
		accessorKey: "sellingPrice",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Selling Price" />
		),
		cell: ({ row }) => {
			const sellingPrice = row.getValue<number>("sellingPrice");
			return formatNumberSafe(sellingPrice);
		},
	},
	{
		accessorKey: "companyInvestedAmount",
		header: () => <Label className="text-lg">7hr Buy Amount</Label>,
		cell: ({ row }) => {
			const companyInvestedAmount = row.getValue<number>(
				"companyInvestedAmount",
			);
			return formatNumberSafe(companyInvestedAmount);
		},
	},
	{
		accessorKey: "shareholderInvestedAmount",
		header: () => <Label className="text-lg">Sharer Buy Amount</Label>,
		cell: ({ row }) => {
			const shareholderInvestedAmount = row.getValue<number>(
				"shareholderInvestedAmount",
			);
			return formatNumberSafe(shareholderInvestedAmount);
		},
	},
	{
		accessorKey: "profitAmount",
		header: () => <Label className="text-lg">Profit Amount</Label>,
		cell: ({ row }) => {
			const profitAmount = row.getValue<number>("profitAmount");
			return formatNumberSafe(profitAmount);
		},
	},
	{
		accessorKey: "companyProfitAmount",
		header: () => <Label className="text-lg">7hr Profit Amount</Label>,
		cell: ({ row }) => {
			const companyProfitAmount = row.getValue<number>("companyProfitAmount");
			return formatNumberSafe(companyProfitAmount);
		},
	},
	{
		accessorKey: "shareholderProfitAmount",
		header: () => <Label className="text-lg">Sharer Profit Amount</Label>,
		cell: ({ row }) => {
			const shareholderProfitAmount = row.getValue<number>(
				"shareholderProfitAmount",
			);
			return formatNumberSafe(shareholderProfitAmount);
		},
	},
	{
		accessorKey: "soldAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Sold Date" />
		),
		cell: ({ row }) => {
			const car = row.original;
			if (car.status === "SOLD" && car.soldAt) {
				return new Date(car.soldAt).toLocaleDateString();
			}
			return "-";
		},
	},
	{
		id: "actions",
		header: () => <Label className="text-lg">Actions</Label>,
		cell: ({ row }) => <CarActions car={row.original} />,
	},
];
