import "dotenv/config";
import * as z from "zod";

const EnvSchema = z.object({
	BETTER_AUTH_SECRET: z.string(),
	BETTER_AUTH_URL: z.string(),

	NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
	CLOUDINARY_API_KEY: z.string(),
	CLOUDINARY_API_SECRET: z.string(),

	SEED_ADMIN_EMAIL: z.email().optional(),
	SEED_ADMIN_PASSWORD: z.string().optional(),

	DATABASE_URL: z.string(),

	// APP_URL: z.string().default("http://localhost:3000"),
});

const envVars = {
	BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
	BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,

	NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
		process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

	SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL,
	SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD,

	DATABASE_URL: process.env.DATABASE_URL,

	// APP_URL: process.env.NEXT_PUBLIC_URL,
};

const parsed = EnvSchema.safeParse(envVars);

if (!parsed.success) {
	const formatted = z.treeifyError(parsed.error);

	throw new Error(
		`Invalid env variables:\n${JSON.stringify(formatted, null, 2)}`,
	);
}

export const env = parsed.data;
