"use server";

import { z } from "zod";
import { cloudinary } from "@/lib/cloudinary";

// Schema for file upload validation
const FileUploadSchema = z.object({
	name: z.string(),
	type: z.string().regex(/^image\//, "Must be an image file"),
	size: z.number().max(5 * 1024 * 1024, "File size must be less than 5MB"),
	base64: z.string(),
});

export type FileUploadData = z.infer<typeof FileUploadSchema>;

export async function uploadFiles(files: FileUploadData[]) {
	const results = [];

	for (const file of files) {
		try {
			const result = await cloudinary.uploader.upload(file.base64, {
				folder: "cars",
				resource_type: "image",
			});

			results.push({
				success: true,
				publicId: result.public_id,
				url: result.secure_url,
				originalName: file.name,
			});
		} catch (error) {
			console.error("Upload failed:", error);
			throw Error("Failed to upload files");
		}
	}

	return results;
}
