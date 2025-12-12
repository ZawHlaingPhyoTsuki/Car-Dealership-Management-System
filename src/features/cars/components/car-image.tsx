"use client";

import { CldImage } from "next-cloudinary";

interface CarImageProps {
	publicId: string;
	alt: string;
	width?: number;
	height?: number;
	className?: string;
}

export default function CarImage({
	publicId,
	alt,
	width = 400,
	height = 300,
	className = "",
}: CarImageProps) {
	return (
		<CldImage
			src={publicId}
			width={width}
			height={height}
			alt={alt}
			crop="fill"
			gravity="auto"
			quality="auto"
			format="auto"
			sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
			className={`rounded-lg shadow-md ${className}`}
		/>
	);
}
