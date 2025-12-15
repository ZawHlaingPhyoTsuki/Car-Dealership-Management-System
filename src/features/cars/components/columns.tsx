"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, EllipsisVertical, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { DataTableColumnHeader } from "@/components/shared/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { formatInLakhsCrores } from "@/lib/utils";
import type { Car } from "../actions/get-cars";
import DeleteCarDialog from "./delete-car-dialog";
import EditCarDialog from "./edit-car-dialog";

export const columns: ColumnDef<Car>[] = [
	{
		id: "no.",
		header: () => <Label className="text-lg">No.</Label>,
		cell: ({ row }) => row.index + 1,
	},
	{
		accessorKey: "name",
		header: () => <Label className="text-lg">Name</Label>,
		cell: ({ row }) => {
			const car = row.original;

			return (
				<div className="flex items-center gap-3 min-w-0">
					{car.photos.length > 0 ? (
						<Image
							src={car.photos[0].url}
							alt={car.name}
							width={50}
							height={30}
							className="rounded-md object-cover shrink-0"
						/>
					) : (
						<div className="h-[50px] w-[50px] rounded-md bg-gray-100 flex items-center justify-center shrink-0">
							<span className="text-xs text-gray-500">No image</span>
						</div>
					)}
					<div className="min-w-0">
						<div className="font-medium truncate">{car.name}</div>

						{car.color && (
							<div className="text-sm text-gray-500 truncate">{car.color}</div>
						)}
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "price",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Price" />
		),
		cell: ({ row }) => {
			const price = Number.parseFloat(row.getValue("price"));
			if (Number.isNaN(price)) return "-";
			const formatted = formatInLakhsCrores(price);
			return formatted;
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
		accessorKey: "licenseNumber",
		header: () => <Label className="text-lg">License No.</Label>,
		cell: ({ row }) => {
			const value = row.getValue("licenseNumber");
			return value || "-";
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
		accessorKey: "createdAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Added At" />
		),
		cell: ({ row }) => {
			const date = row.getValue("createdAt");
			if (!date) return "-";
			return new Date(date as Date).toLocaleDateString();
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

			<EditCarDialog
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
