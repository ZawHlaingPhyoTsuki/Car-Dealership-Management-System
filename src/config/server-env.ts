import * as z from "zod";

const ServerEnvSchema = z.object({
	// Server-only variables (no NEXT_PUBLIC_ prefix)
	BETTER_AUTH_SECRET: z.string(),
	BETTER_AUTH_URL: z.string(),
	CLOUDINARY_CLOUD_NAME: z.string(),
	CLOUDINARY_API_KEY: z.string(),
	CLOUDINARY_API_SECRET: z.string(),
	DATABASE_URL: z.string(),
	SEED_ADMIN_EMAIL: z.email().optional(),
	SEED_ADMIN_PASSWORD: z.string().optional(),
});

export const serverEnv = ServerEnvSchema.parse(process.env);
