import * as z from "zod";
import { ExpenseCategory } from "@/app/generated/prisma/enums";

export const CreateExpenseSchema = z.object({
	date: z.date(),
	paidToId: z.uuidv4("Employee Id must be a valid UUID").optional().nullable(),
	category: z.enum(ExpenseCategory),
	amount: z.number().min(0, "Amount must be at least 0"),
	carId: z.uuidv4("Car Id must be a valid UUID").optional().nullable(),
	notes: z
		.string()
		.trim()
		.transform((v) => (v === "" ? "" : v))
		.pipe(z.string().max(300, "Note must not be more than 300 characters")),
});

export type CreateExpenseValues = z.infer<typeof CreateExpenseSchema>;

export const UpdateExpenseSchema = CreateExpenseSchema.partial().extend({
	id: z.uuidv4("Id must be a valid UUID"),
});

export type UpdateExpenseValues = z.infer<typeof UpdateExpenseSchema>;
