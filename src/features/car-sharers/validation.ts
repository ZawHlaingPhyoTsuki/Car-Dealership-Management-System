import * as z from "zod";

export const UpdateCarSharerSchema = z.object({
	id: z.uuidv4("Invalid ID format"),
	price: z.number().min(0, "Price must be a non-negative number"),
	shareholderPercentage: z
		.number()
		.min(0, "Shareholder percentage must be a non-negative number")
		.max(100, "Shareholder percentage must be less than or equal to 100")
		.optional(),
	investmentAmount: z
		.number()
		.min(0, "Investment amount must be a non-negative number")
		.optional(),
	shareholderId: z.uuidv4("Invalid ID format").optional().nullable(),
});

export type UpdateCarSharerValues = z.infer<typeof UpdateCarSharerSchema>;
