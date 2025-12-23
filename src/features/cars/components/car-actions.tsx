"use client";

import { Edit, EllipsisVertical, Trash, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Car } from "../actions/get-cars";
import DeleteCarDialog from "./delete-car-dialog";
import EditCarDialog from "./edit-car-dialog";
import UploadCarImageDialog from "./upload-car-image-dialog";

export function CarActions({ car }: { car: Car }) {
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showImageDialog, setShowImageDialog] = useState(false);

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

					<DropdownMenuItem onClick={() => setShowImageDialog(true)}>
						<Upload className="mr-2 h-4 w-4" />
						{car.imageUrl ? "Change Image" : "Add Image"}
					</DropdownMenuItem>

					<DropdownMenuItem
						onClick={() => setShowDeleteDialog(true)}
						className="text-destructive"
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

			<UploadCarImageDialog
				carId={car.id}
				currentImageUrl={car.imageUrl}
				imagePublicId={car.imagePublicId}
				open={showImageDialog}
				onOpenChange={setShowImageDialog}
				onSuccess={() => {
					// Optional: refresh cars list or just rely on query invalidation
				}}
			/>
		</>
	);
}
