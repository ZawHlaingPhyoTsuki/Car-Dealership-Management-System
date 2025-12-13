"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, EllipsisVertical, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PaidMethod } from "@/app/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import type { Car } from "@/features/cars/actions/get-cars";
import DeleteCarDialog from "@/features/cars/components/delete-car-dialog";
import EditCarDialog from "@/features/cars/components/edit-car-dialog";
import {
	companyProfitAndPercentageCalculator,
	formatInLakhsCrores,
	shareholderProfitAndPercentageCalculator,
} from "@/lib/utils";

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
							height={50}
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
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(price);
			return formatted;
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
		accessorKey: "7hrs-profit",
		header: "7hrs Profit",
		cell: ({ row }) => {
			const price = row.original.price;
			const percentage = row.original.shareholderPercentage || 0;
			const { companyProfit, companyPercentage } =
				companyProfitAndPercentageCalculator(price, percentage);
			return (
				<Label className="text-emerald-500">
					<span className="text-lg text-green-500">{companyPercentage}%</span> (
					{formatInLakhsCrores(companyProfit)})
				</Label>
			);
		},
	},
	{
		accessorKey: "sharer-profit",
		header: "Sharer Profit",
		cell: ({ row }) => {
			const price = row.original.price;
			const percentage = row.original.shareholderPercentage || 0;
			const { shareholderProfit, shareholderPercentage } =
				shareholderProfitAndPercentageCalculator(price, percentage);
			return (
				<Label className="text-amber-600">
					<span className="text-lg text-amber-500">
						{shareholderPercentage}%
					</span>{" "}
					({formatInLakhsCrores(shareholderProfit)})
				</Label>
			);
		},
	},
	{
		accessorKey: "investmentAmount",
		header: "Invested Amount",
		cell: ({ row }) => {
			const investmentAmount = Number.parseFloat(
				row.getValue("investmentAmount"),
			);
			if (!investmentAmount) return "-";
			return (
				<div className="text-blue-600">
					{formatInLakhsCrores(investmentAmount)}
				</div>
			);
		},
	},
	{
		accessorKey: "paidMethod",
		header: "Paid Method",
		cell: ({ row }) => {
			const paidMethod = row.getValue("paidMethod") as PaidMethod;
			if (!paidMethod) return "-";
			const colors: Record<PaidMethod, string> = {
				[PaidMethod.CASH]: "bg-green-100 text-green-800",
				[PaidMethod.SCAN]: "bg-blue-100 text-blue-800",
			};

			return (
				<Badge variant="outline" className={colors[paidMethod]}>
					{paidMethod}
				</Badge>
			);
		},
	},
	{
		accessorKey: "soldAt",
		header: "Sold Date",
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
