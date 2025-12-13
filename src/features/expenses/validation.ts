import * as z from "zod";
import { ExpenseCategory } from "@/app/generated/prisma/enums";

export const CreateExpenseSchema = z.object({
	date: z.date(),
	paidToId: z
		.string()
		.min(3, "Empoyee Id must be at at least 3 characters long.")
		.optional(),
	category: z.enum(ExpenseCategory),
	amount: z.number().min(1, "Amount must be greater than 1"),
	carId: z
		.string()
		.min(3, "Car Id must be at least 3 characters long")
		.optional(),
	notes: z
		.string()
		.trim()
		// Cuz DB schema is NOTNULL(i think it should be nullable)
		// .transform((v) => (v === '' ? undefined : v))
		.transform((v) => (v === "" ? "extra notes" : v))
		.pipe(z.string().max(300, "Note must not be more than 300 characters")),
	// .optional()
});

export type CreateExpenseValues = z.infer<typeof CreateExpenseSchema>;

export const UpdateExpenseSchema = z.object({
	date: z.date(),
	paidToId: z
		.string()
		.min(3, "Empoyee Id must be at at least 3 characters long.")
		.optional(),
	category: z.enum(ExpenseCategory),
	amount: z.number().min(1, "Amount must be greater than 1"),
	carId: z
		.string()
		.min(3, "Car Id must be at least 3 characters long")
		.optional(),
	notes: z
		.string()
		.trim()
		// Cuz DB schema is NOTNULL(i think it should be nullable)
		// .transform((v) => (v === '' ? undefined : v))
		.transform((v) => (v === "" ? "extra notes" : v))
		.pipe(z.string().max(300, "Note must not be more than 300 characters")),
	// .optional(),
});

export type UpdateExpenseValues = z.infer<typeof UpdateExpenseSchema>;
