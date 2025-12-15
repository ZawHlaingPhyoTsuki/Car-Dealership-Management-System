import * as z from "zod";

export const CreateEmployeeSchema = z.object({
	name: z.string().trim().min(3, "Name must be at least 3 characters long."),
	position: z.string().trim().or(z.literal("")),
	salary: z.number().min(0, "Salary must be at least 0.").optional(),
	percentage: z
		.number()
		.min(0, "Percentage must be at least 0.")
		.max(100, "Percentage must be at most 100."),
	startDate: z.date(),
});

export type CreateEmployeeValues = z.infer<typeof CreateEmployeeSchema>;

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial().extend({
	id: z.uuidv4(),
});

export type UpdateEmployeeValues = z.infer<typeof UpdateEmployeeSchema>;
