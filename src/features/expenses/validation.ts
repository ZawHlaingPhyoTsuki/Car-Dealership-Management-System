import * as z from "zod";

export const CreateExpenseSchema = z.object({
	date: z.date(),
	paidToId: z.uuidv4("Employee Id must be a valid UUID").optional().nullable(),
	categoryId: z
		.uuidv4("Category Id must be a valid UUID")
		.optional()
		.nullable(),
	amount: z.number().min(0, "Amount must be at least 0"),
	carId: z.uuidv4("Car Id must be a valid UUID").optional().nullable(),
	notes: z
		.string()
		.trim()
		.transform((v) => (v === "" ? "" : v))
		.pipe(z.string().max(300, "Note must not be more than 300 characters")),
});

export const UpdateExpenseSchema = CreateExpenseSchema.partial().extend({
	id: z.uuidv4("Id must be a valid UUID"),
});

export const CreateExpenseCategorySchema = z.object({
	name: z
		.string()
		.min(1, "Name must not be empty")
		.max(100, "Name must not be more than 100 characters"),
});

export const UpdateExpenseCategorySchema = CreateExpenseCategorySchema.extend({
	id: z.uuidv4("Id must be a valid UUID"),
});

export type CreateExpenseValues = z.infer<typeof CreateExpenseSchema>;
export type UpdateExpenseValues = z.infer<typeof UpdateExpenseSchema>;
export type CreateExpenseCategoryValues = z.infer<
	typeof CreateExpenseCategorySchema
>;
export type UpdateExpenseCategoryValues = z.infer<
	typeof UpdateExpenseCategorySchema
>;

export const FilterExpenseByCarSchema = z.object({
	carId: z.uuidv4("Car Id must be a valid UUID").optional().nullable(),
});
export type FilterExpenseByCarValues = z.infer<typeof FilterExpenseByCarSchema>;
