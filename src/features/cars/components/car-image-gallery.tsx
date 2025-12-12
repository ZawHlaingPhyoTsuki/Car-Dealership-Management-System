"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CarImageGalleryProps {
	photos: Photo[];
	carName: string;
}

export default function CarImageGallery({
	photos,
	carName,
}: CarImageGalleryProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	if (photos.length === 0) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center h-96">
					<div className="text-center text-muted-foreground">
						<div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
							<svg
								className="w-8 h-8"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<p>No images available</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const currentPhoto = photos[currentIndex];

	const nextImage = () => {
		setCurrentIndex((prev) => (prev + 1) % photos.length);
	};

	const prevImage = () => {
		setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
	};

	return (
		<div className="space-y-4">
			{/* Main Image */}
			<Card>
				<CardContent className="p-0 relative">
					<div className={`relative h-96 md:h-[500px]`}>
						<Image
							src={currentPhoto.url}
							alt={currentPhoto.alt || `${carName} - Image ${currentIndex + 1}`}
							fill
							className={`object-contain transition-all duration-300`}
							sizes="(max-width: 768px) 100vw, 80vw"
						/>

						{/* Navigation buttons */}
						{photos.length > 1 && (
							<>
								<Button
									variant="secondary"
									size="icon"
									className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
									onClick={prevImage}
								>
									<ChevronLeft className="w-4 h-4" />
								</Button>
								<Button
									variant="secondary"
									size="icon"
									className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
									onClick={nextImage}
								>
									<ChevronRight className="w-4 h-4" />
								</Button>
							</>
						)}

						{/* Image counter */}
						<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
							{currentIndex + 1} / {photos.length}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Thumbnails */}
			{photos.length > 1 && (
				<div className="flex gap-2 overflow-x-auto pb-2">
					{photos.map((photo, index) => (
						<button
							type="button"
							key={photo.id}
							className={`shrink-0 w-24 h-20 relative rounded-lg overflow-hidden border-2 transition-all ${
								index === currentIndex
									? "border-primary ring-2 ring-primary ring-opacity-50"
									: "border-transparent hover:border-muted-foreground"
							}`}
							onClick={() => setCurrentIndex(index)}
						>
							<Image
								src={photo.url}
								alt={photo.alt || `Thumbnail ${index + 1}`}
								fill
								className="object-cover"
								sizes="96px"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
