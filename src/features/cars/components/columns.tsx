"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, EllipsisVertical, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatInLakhsCrores } from "@/lib/utils";
import type { Car } from "../actions/get-cars";
import DeleteCarDialog from "./delete-car-dialog";
import EditCarDialog from "./edit-car-dialog";

export const columns: ColumnDef<Car>[] = [
	{
		id: "no.",
		header: "No.",
		cell: ({ row }) => row.index + 1,
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => {
			const car = row.original;
			return (
				<div className="flex items-center gap-3">
					{car.photos.length > 0 ? (
						<Image
							src={car.photos[0].url}
							alt={car.name}
							width={50}
							height={30}
							className="rounded-md object-cover"
						/>
					) : (
						<div className="h-[50px] w-[50px] rounded-md bg-gray-100 flex items-center justify-center">
							<span className="text-xs text-gray-500">No image</span>
						</div>
					)}
					<div>
						<div className="font-medium">{car.name}</div>
						{car.color && (
							<div className="text-sm text-gray-500">{car.color}</div>
						)}
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "price",
		header: "Price",
		cell: ({ row }) => {
			const price = Number.parseFloat(row.getValue("price"));
			const formatted = formatInLakhsCrores(price);
			return formatted;
		},
	},
	{
		accessorKey: "status",
		header: "Status",
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
		header: "License No.",
		cell: ({ row }) => {
			const value = row.getValue("licenseNumber");
			return value || "-";
		},
	},
	{
		accessorKey: "paidAmount",
		header: "Paid Amount",
		cell: ({ row }) => {
			const paidAmount = Number.parseFloat(row.getValue("paidAmount"));
			if (!paidAmount) return "-";
			const formatted = formatInLakhsCrores(paidAmount);
			return formatted;
		},
	},
	{
		accessorKey: "paidMethod",
		header: "Paid Method",
		cell: ({ row }) => {
			const paidMethod = row.getValue("paidMethod");
			return paidMethod || "-";
		},
	},
	{
		accessorKey: "createdAt",
		header: "Added At",
		cell: ({ row }) => {
			const date = row.getValue("createdAt");
			if (!date) return "-";
			return new Date(date as Date).toLocaleDateString();
		},
	},
	{
		accessorKey: "actions",
		header: "Actions",
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
