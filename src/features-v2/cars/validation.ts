import z from "zod";
import { CarStatus } from "@/app/generated/prisma/enums";

export const CreateCarSchema = z.object({
	name: z.string().min(1, "Name is required"),
	status: z.enum(CarStatus).optional(),

	purchasedPrice: z
		.int()
		.min(0, "Purchased price cannot be negative")
		.optional(),
	sellingPrice: z.int().min(0, "Selling price cannot be negative").optional(),

	companyInvestedAmount: z.int().min(0).optional(),
	shareholderInvestedAmount: z.int().min(0).optional(),

	companyProfitAmount: z.int().min(0).optional(),
	shareholderProfitAmount: z.int().min(0).optional(),

	licenseNumber: z.string().optional().nullable(),
	soldAt: z.date().optional().nullable(),

	notes: z.string().optional().nullable(),

	shareholderId: z.uuidv4().optional().nullable(),
});

export const UpdateCarSchema = CreateCarSchema.extend({
	id: z.uuidv4(),
});

export type CreateCarValues = z.infer<typeof CreateCarSchema>;
export type UpdateCarValues = z.infer<typeof UpdateCarSchema>;
