import * as z from "zod";
import { CarStatus } from "@/app/generated/prisma/enums";

export const CreateCarSchema = z
	.object({
		name: z.string("Name is required").min(1, "Name is required"),
		price: z.number().min(0, "Price must be at least 0"),
		color: z.string().optional(),
		licenseNumber: z.string().optional(),
		status: z.enum(CarStatus),
		notes: z.string().optional(),
		soldAt: z.date().optional().nullable(),
	})
	.superRefine((data, ctx) => {
		if (data.status === CarStatus.SOLD && !data.soldAt) {
			ctx.addIssue({
				path: ["soldAt"],
				message: "Sold date is required when status is SOLD",
				code: "custom",
			});
		}
	});

export type CreateCarValues = z.infer<typeof CreateCarSchema>;

export const UpdateCarSchema = CreateCarSchema.partial().extend({
	id: z.uuidv4("Id must be a valid UUID"),
});

export type UpdateCarValues = z.infer<typeof UpdateCarSchema>;
