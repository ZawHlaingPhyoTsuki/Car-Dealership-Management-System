"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, EllipsisVertical, Trash } from "lucide-react";
import { useState } from "react";
import { DataTableColumnHeader } from "@/components/shared/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import DeleteCarDialog from "@/features/cars/components/delete-car-dialog";
import type { Car } from "@/features-v2/cars/actions/get-cars";
import { formatNumberSafe } from "@/lib/utils";
import EditCarSharerDialog from "./edit-car-sharer-dialog";

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
		header: () => <Label className="text-lg">Selling Price</Label>,
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
		accessorKey: "actions",
		header: () => <Label className="text-lg">Actions</Label>,
		cell: ({ row }) => <CarActions car={row.original} />,
	},
];

function CarActions({ car }: { car: Car }) {
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<EllipsisVertical className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => setShowEditDialog(true)}>
						<Edit className="mr-2 h-4 w-4" />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => setShowDeleteDialog(true)}
						variant="destructive"
					>
						<Trash className="mr-2 h-4 w-4" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<EditCarSharerDialog
				car={car}
				open={showEditDialog}
				onOpenChange={setShowEditDialog}
			/>

			<DeleteCarDialog
				id={car.id}
				name={car.name}
				open={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
			/>
		</>
	);
}
