import { v2 as cloudinary } from "cloudinary";
import { env } from "@/config/env";

cloudinary.config({
	cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: env.CLOUDINARY_API_KEY,
	api_secret: env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export const cloudinaryHelpers = {
	// Generate optimized image URL
	generateCarImageUrl(publicId: string, width = 800, height = 600) {
		return cloudinary.url(publicId, {
			width,
			height,
			crop: "fill",
			quality: "auto",
			format: "auto",
		});
	},

	// Upload image (for server-side uploads)
	async uploadImage(filePath: string, folder = "cars") {
		return cloudinary.uploader.upload(filePath, {
			folder,
			resource_type: "auto",
		});
	},

	// Delete image
	async deleteImage(publicId: string) {
		return cloudinary.uploader.destroy(publicId, {
			invalidate: true, // Clear CDN cache
		});
	},
};
