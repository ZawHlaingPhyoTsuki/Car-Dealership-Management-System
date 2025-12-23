"use server";

import type { UploadApiOptions } from "cloudinary";
import { requireAuth } from "@/lib/auth-guard";
import { cloudinary } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function uploadCarImage({
	carId,
	file,
	oldPublicId,
}: {
	carId: string;
	file: File;
	oldPublicId?: string | null;
}) {
	await requireAuth();

	// Validate file
	if (!file || !file.type.startsWith("image/")) {
		throw new Error("Invalid image file");
	}

	if (file.size > MAX_FILE_SIZE) {
		throw new Error("File size exceeds 10MB limit");
	}

	// Upload to Cloudinary
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	const cloudinaryOptions: UploadApiOptions = {
		folder: "7hr_automobile/cars",
		resource_type: "image",
		transformation: {
			width: 500,
			height: 500,
			crop: "fill",
		},
	};

	const uploadResult = await new Promise<{ url: string; publicId: string }>(
		(resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				cloudinaryOptions,
				(error, result) => {
					if (error) {
						reject(error);
					} else if (!result) {
						reject(new Error("Upload failed"));
					} else {
						resolve({ url: result.secure_url, publicId: result.public_id });
					}
				},
			);
			uploadStream.end(buffer);
		},
	);

	// Find car
	const car = await prisma.car.findUnique({ where: { id: carId } });
	if (!car) throw new Error("Car not found");

	// Delete old image if exists
	if (oldPublicId && oldPublicId !== uploadResult.publicId) {
		try {
			await cloudinary.uploader.destroy(oldPublicId);
		} catch (error) {
			console.warn("Failed to delete old image:", error);
			// Continue anyway
		}
	}

	// Update database
	await prisma.car.update({
		where: { id: carId },
		data: {
			imageUrl: uploadResult.url,
			imagePublicId: uploadResult.publicId,
		},
	});

	return { url: uploadResult.url, publicId: uploadResult.publicId };
}
