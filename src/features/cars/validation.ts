import * as z from "zod";
import { CarStatus } from "@/app/generated/prisma/enums";

export const CreateCarSchema = z
	.object({
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

		notes: z.string().trim().optional().nullable(),

		shareholderId: z.uuidv4().optional().nullable(),
	})
	.superRefine((data, ctx) => {
		const purchasedPrice = data.purchasedPrice;
		const companyInvestedAmount = data.companyInvestedAmount;
		const shareholderInvestedAmount = data.shareholderInvestedAmount;

		//only for now(amounts)
		//need adjustment with shareholder(skip now)
		if (
			purchasedPrice !== undefined &&
			companyInvestedAmount !== undefined &&
			shareholderInvestedAmount !== undefined
		) {
			const total = companyInvestedAmount + shareholderInvestedAmount;
			const message = `Total invested (${total}) must equal purchased price (${data.purchasedPrice})`;
			if (total !== purchasedPrice) {
				ctx.addIssue({
					code: "custom",
					message,
					path: ["companyInvestedAmount"],
				});
				ctx.addIssue({
					code: "custom",
					message,
					path: ["shareholderInvestedAmount"],
				});
			}
		}
	});

export const UpdateCarSchema = CreateCarSchema.safeExtend({
	id: z.uuidv4(),
});

export type CreateCarValues = z.infer<typeof CreateCarSchema>;
export type UpdateCarValues = z.infer<typeof UpdateCarSchema>;
