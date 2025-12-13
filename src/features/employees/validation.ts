import * as z from "zod";

export const CreateEmployeeSchema = z.object({
	name: z.string().trim().min(3, "Name must be at least 3 characters long."),
	email: z.email("Invalid email address."),
	position: z
		.string()
		.trim()
		.min(3, "Position must be at least 3 characters long."),
	phone: z
		.string()
		.min(10, "Phone number must be at least 10 characters long.")
		.optional(),
	address: z
		.string()
		.min(3, "Address must be at least 3 characters long.")
		.optional(),
	salary: z.number().min(1, "Salary must be at least 1."),
});

export type CreateEmployeeValues = z.infer<typeof CreateEmployeeSchema>;

export const UpdateEmployeeSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters."),
	email: z.email("Invalid email address."),
	position: z.string().min(3, "Position is required."),
	salary: z.number().min(1, "Salary must be at least 1."),
	phone: z
		.string()
		.optional()
		.transform((v) => (v === "" ? undefined : v))
		.pipe(
			z.string().min(10, "Phone must be at least 10 characters.").optional(),
		),
	address: z
		.string()
		.optional()
		.transform((v) => (v === "" ? undefined : v))
		.pipe(
			z.string().min(3, "Address must be at least 3 characters.").optional(),
		),
});

export type UpdateEmployeeValues = z.infer<typeof UpdateEmployeeSchema>;
