"use client";

import Image from "next/image";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Car } from "../actions/get-cars";

export function CarNameCell({ car }: { car: Car }) {
	const [isImageOpen, setIsImageOpen] = useState(false);

	return (
		<>
			<div className="flex items-center gap-2 min-w-0 w-full">
				<button
					type="button"
					className="relative shrink-0 cursor-pointer"
					onClick={() => setIsImageOpen(true)}
					aria-label={`View larger image of ${car.name}`}
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

			<Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
				<DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
					<DialogHeader className="sr-only">
						<DialogTitle>{car.name} - Image Preview</DialogTitle>
						<DialogDescription>Zoomed view of the car image</DialogDescription>
					</DialogHeader>
					<div className="relative w-full h-[80vh]">
						<Image
							src={car.imageUrl || "/placeholder.png"}
							alt={car.imageUrl ? `${car.name} image` : "No image available"}
							fill
							className="object-contain p-4"
							sizes="(max-width: 1024px) 100vw, 1024px"
						/>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
