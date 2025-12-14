import * as z from "zod";

export const UpdateCarSharerSchema = z.object({
	id: z.uuidv4(),
	price: z.number().min(0, "Price must be a positive number"),
	shareholderPercentage: z
		.number()
		.min(0, "Shareholder percentage must be a positive number")
		.max(100, "Shareholder percentage must be less than or equal to 100")
		.optional(),
	investmentAmount: z
		.number()
		.min(0, "Investment amount must be a positive number")
		.optional(),
	shareholderName: z
		.string()
		.min(3, "Shareholder name must be at least 3 characters long")
		.optional()
		.or(z.literal("")),
	shareholderEmail: z
		.email("Invalid email address")
		.optional()
		.or(z.literal("")),
	shareholderPhone: z
		.string()
		.min(6, "Shareholder phone must be at least 6 characters long")
		.optional()
		.or(z.literal("")),
	shareholderId: z.string().optional().or(z.literal("")).nullable(),
});

export type UpdateCarSharerValues = z.infer<typeof UpdateCarSharerSchema>;
