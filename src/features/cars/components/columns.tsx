"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useState } from "react";
import { DataTableColumnHeader } from "@/components/shared/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
			const [isImageOpen, setIsImageOpen] = useState(false);

			return (
				<>
					<div className="flex items-center gap-2 min-w-0 w-full">
						<button
							type="button"
							className="relative shrink-0 cursor-pointer"
							onClick={() => setIsImageOpen(true)}
						>
							<Image
								src={car.imageUrl || "/placeholder.png"}
								alt={car.imageUrl ? `${car.name} image` : "No image available"}
								width={50}
								height={50}
								className="rounded-md object-cover hover:opacity-90 transition-opacity"
							/>
							{car.imageUrl && (
								<div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors rounded-md" />
							)}
						</button>
						<div className="flex flex-col min-w-0 flex-1 overflow-hidden">
							<div
								className={`font-medium truncate ${car.shareholderId ? "text-amber-500" : "text-green-500"}`}
							>
								{car.name}
							</div>
							{car.licenseNumber && (
								<div className="text-xs text-muted-foreground truncate">
									{car.licenseNumber}
								</div>
							)}
						</div>
					</div>

					{/* Image Modal */}
					<Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
						<DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
							<DialogHeader className="sr-only">
								<DialogTitle>{car.name} - Image Preview</DialogTitle>
								<DialogDescription>
									Zoomed view of the car image
								</DialogDescription>
							</DialogHeader>
							<div className="relative w-full h-[80vh]">
								<Image
									src={car.imageUrl || "/placeholder.png"}
									alt={
										car.imageUrl ? `${car.name} image` : "No image available"
									}
									fill
									className="object-contain p-4"
									sizes="(max-width: 1024px) 100vw, 1024px"
									priority
								/>
							</div>
						</DialogContent>
					</Dialog>
				</>
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
