import * as z from "zod";
import { CarStatus } from "@/app/generated/prisma/enums";

export const CreateCarSchema = z.object({
	name: z.string().min(1, "Name is required"),
	price: z.number().min(0, "Price must be at least 0"),
	color: z
		.string()
		.optional()
		.transform((e) => (e === "" ? undefined : e))
		.optional(),
	licenseNumber: z
		.string()
		.optional()
		.transform((e) => (e === "" ? undefined : e))
		.optional(),
	status: z.enum(CarStatus),
	notes: z
		.string()
		.optional()
		.transform((e) => (e === "" ? undefined : e))
		.optional(),
});

export type CreateCarValues = z.infer<typeof CreateCarSchema>;

export const UpdateCarSchema = CreateCarSchema.partial().extend({
	id: z.uuidv4(),
});

export type UpdateCarValues = z.infer<typeof UpdateCarSchema>;
