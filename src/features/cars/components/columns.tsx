"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { DataTableColumnHeader } from "@/components/shared/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { formatNumberSafe } from "@/lib/utils";
import type { Car } from "../actions/get-cars";
import { CarActions } from "./car-actions";

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
				<div className="flex items-center gap-2 min-w-0">
					<Image
						src={car.imageUrl || "/placeholder.png"}
						alt={car.imageUrl ? `${car.name} image` : "No image available"}
						width={50}
						height={50}
					/>
					<div className="flex flex-col">
						<div
							className={`font-medium truncate ${car.shareholderId ? "text-amber-500" : "text-green-500"}`}
						>
							{car.name}
						</div>
						{car.licenseNumber && (
							<div className="text-xs text-muted-foreground">
								{car.licenseNumber}
							</div>
						)}
					</div>
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
		accessorKey: "totalExpenses",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Total Expenses" />
		),
		cell: ({ row }) => {
			const totalExpenses = row.getValue<number>("totalExpenses");
			return formatNumberSafe(totalExpenses);
		},
	},
	{
		accessorKey: "totalCost",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Total Cost" />
		),
		cell: ({ row }) => {
			const totalCost = row.getValue<number>("totalCost");
			return formatNumberSafe(totalCost);
		},
	},
	{
		accessorKey: "status",
		header: () => <Label className="text-lg">Status</Label>,
		cell: ({ row }) => {
			const status: string = row.getValue("status");
			let variant:
				| "default"
				| "destructive"
				| "outline"
				| "secondary"
				| "success"
				| "warning" = "default";
			if (status === "AVAILABLE") variant = "success";
			if (status === "IN_MAINTENANCE") variant = "secondary";
			if (status === "RESERVED") variant = "warning";
			if (status === "SOLD") variant = "destructive";
			return (
				<Badge className="capitalize" variant={variant}>
					{status.toLowerCase().replace(/_/g, " ")}
				</Badge>
			);
		},
	},
	{
		accessorKey: "shareholderName",
		header: () => <Label className="text-lg">Sharer Name</Label>,
		cell: ({ row }) => {
			const shareholder = row.original.shareholder;
			if (!shareholder) return "-";
			return (
				<HoverCard>
					<HoverCardTrigger asChild>
						<Button variant="link" className="px-0">
							{shareholder.name}
						</Button>
					</HoverCardTrigger>
					<HoverCardContent>
						<div className="space-y-1">
							<h4 className="text-sm font-semibold">{shareholder.name}</h4>
							<p className="text-muted-foreground text-xs">
								<span className="font-medium">Phone:</span>{" "}
								{shareholder.phone || "N/A"}
							</p>
							<div className="text-muted-foreground text-xs">
								<span className="font-medium">Joined:</span>
								{shareholder.createdAt
									? new Date(shareholder.createdAt).toLocaleDateString()
									: "N/A"}
							</div>
						</div>
					</HoverCardContent>
				</HoverCard>
			);
		},
	},
	{
		accessorKey: "notes",
		header: () => <Label className="text-lg">Notes</Label>,
		cell: ({ row }) => {
			const notes = row.original.notes || "-";
			const preview = notes.length <= 20 ? notes : `${notes.slice(0, 10)}...`;
			return (
				<HoverCard>
					<HoverCardTrigger asChild>
						<span className="cursor-pointer text-muted-foreground">
							{preview}
						</span>
					</HoverCardTrigger>

					<HoverCardContent className="max-w-sm wrap-break-word">
						{notes}
					</HoverCardContent>
				</HoverCard>
			);
		},
	},
	{
		accessorKey: "soldAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Sold Date" />
		),
		cell: ({ row }) => {
			const date = row.getValue("soldAt");
			if (!date) return "-";
			return new Date(date as Date).toLocaleDateString();
		},
	},
	{
		id: "actions",
		header: () => <Label className="text-lg">Actions</Label>,
		cell: ({ row }) => <CarActions car={row.original} />,
	},
];
