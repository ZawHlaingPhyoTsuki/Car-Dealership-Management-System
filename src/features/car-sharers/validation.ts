import * as z from "zod";

export const CreateCarSharerSchema = z.object({
	name: z.string().min(1, "Name is required"),
	phone: z.string().optional().or(z.literal("")),
	notes: z.string().optional().or(z.literal("")),
});

export type CreateCarSharerValues = z.infer<typeof CreateCarSharerSchema>;

export const UpdateCarSharerSchema = z.object({
	id: z.uuidv4("Invalid ID format"),
	price: z.number().min(1, "Price must be at least 1"),
	shareholderPercentage: z
		.number()
		.min(0, "Shareholder percentage must be at least 0")
		.max(100, "Shareholder percentage must be less than or equal to 100")
		.optional(),
	investmentAmount: z
		.number()
		.min(0, "Investment amount must be at least 0")
		.optional(),
	shareholderId: z.uuidv4("Invalid ID format").optional().nullable(),
});

export type UpdateCarSharerValues = z.infer<typeof UpdateCarSharerSchema>;
