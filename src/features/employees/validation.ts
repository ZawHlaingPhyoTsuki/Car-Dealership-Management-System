import * as z from "zod";

export const CreateEmployeeSchema = z.object({
	name: z.string().trim().min(3, "Name must be at least 3 characters long."),
	position: z
		.string()
		.trim()
		.min(3, "Position must be at least 3 characters long."),
	salary: z.number().min(1, "Salary must be at least 1."),
	percentage: z.number().min(1, "Percentage must be at least 1."),
});

export type CreateEmployeeValues = z.infer<typeof CreateEmployeeSchema>;

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial().extend({
	id: z.uuidv4(),
});

export type UpdateEmployeeValues = z.infer<typeof UpdateEmployeeSchema>;
