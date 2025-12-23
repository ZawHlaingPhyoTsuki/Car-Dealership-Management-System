"use server";

import { requireAuth } from "@/lib/auth-guard";
import { cloudinary } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

export async function deleteCarImage({
	carId,
	oldPublicId,
}: {
	carId: string;
	oldPublicId?: string | null;
}) {
	await requireAuth();

	// Validate input
	if (!carId) {
		throw new Error("Car ID is required");
	}

	// Find the car
	const car = await prisma.car.findUnique({
		where: { id: carId },
		select: { imagePublicId: true },
	});

	if (!car) {
		throw new Error("Car not found");
	}

	// If the car has no image, return early
	if (!car.imagePublicId && !oldPublicId) {
		return { success: true, message: "No image to delete" };
	}

	// Use the public ID from the database if available, otherwise use the provided one
	const publicIdToDelete = car.imagePublicId || oldPublicId;

	try {
		// Delete from Cloudinary first (non-critical operation)
		if (publicIdToDelete) {
			try {
				await cloudinary.uploader.destroy(publicIdToDelete);
			} catch (error) {
				console.warn("Failed to delete image from Cloudinary:", error);
				// Continue with database update even if Cloudinary deletion fails
			}
		}

		// Update database to remove image reference
		await prisma.car.update({
			where: { id: carId },
			data: {
				imageUrl: null,
				imagePublicId: null,
			},
		});

		return { success: true, message: "Image deleted successfully" };
	} catch (error) {
		console.error("Failed to delete car image:", error);
		throw new Error("Failed to delete image. Please try again.");
	}
}
