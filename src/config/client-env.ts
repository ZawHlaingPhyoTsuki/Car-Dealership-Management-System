import * as z from "zod";

const ClientEnvSchema = z.object({
	// Client-accessible variables (NEXT_PUBLIC_ prefix)
	// NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
	NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string(),
});

export const clientEnv = ClientEnvSchema.parse({
	// NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
	// 	process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET:
		process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
});
