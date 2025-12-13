import { describe, expect, it } from "vitest";
import { CarStatus, PaidMethod } from "@/app/generated/prisma/enums";
import { CreateCarSchema, UpdateCarSchema } from "./validation";

describe("Validation Schemas", () => {
	describe("CreateCarSchema", () => {
		it("should validate a correct car object", () => {
			const validCar = {
				name: "Toyota Camry",
				price: 25000,
				color: "Silver",
				licenseNumber: "ABC-1234",
				status: CarStatus.AVAILABLE,
				notes: "Brand new",
				paidMethod: PaidMethod.CASH,
				paidAmount: 25000,
			};

			const result = CreateCarSchema.safeParse(validCar);
			expect(result.success).toBe(true);
		});

		it("should validate a correct car object with minimal required fields", () => {
			const minimalCar = {
				name: "Honda Civic",
				price: 20000,
				status: CarStatus.AVAILABLE,
			};

			const result = CreateCarSchema.safeParse(minimalCar);
			expect(result.success).toBe(true);
		});

		it("should fail validation if name is missing", () => {
			const invalidCar = {
				price: 20000,
				status: CarStatus.AVAILABLE,
			};

			const result = CreateCarSchema.safeParse(invalidCar);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].path).toContain("name");
			}
		});

		it("should fail validation if price is negative", () => {
			const invalidCar = {
				name: "Tesla Model 3",
				price: -100,
				status: CarStatus.AVAILABLE,
			};

			const result = CreateCarSchema.safeParse(invalidCar);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].path).toContain("price");
			}
		});

		it("should transform empty strings to undefined for optional fields", () => {
			const carWithEmptyStrings = {
				name: "Ford Mustang",
				price: 35000,
				status: CarStatus.AVAILABLE,
				color: "",
				licenseNumber: "",
				notes: "",
			};

			const result = CreateCarSchema.safeParse(carWithEmptyStrings);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.color).toBeUndefined();
				expect(result.data.licenseNumber).toBeUndefined();
				expect(result.data.notes).toBeUndefined();
			}   
		});

		it("should allow null for paidMethod", () => {
			const carWithNullPaidMethod = {
				name: "BMW 3 Series",
				price: 45000,
				status: CarStatus.AVAILABLE,
				paidMethod: null,
			};

			const result = CreateCarSchema.safeParse(carWithNullPaidMethod);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.paidMethod).toBeNull();
			}
		});
	});

	describe("UpdateCarSchema", () => {
		it("should validate a correct partial update object", () => {
			const validUpdate = {
				id: "some-uuid",
				price: 24000,
				status: CarStatus.SOLD,
			};

			const result = UpdateCarSchema.safeParse(validUpdate);
			expect(result.success).toBe(true);
		});

		it("should fail validation if id is missing", () => {
			const invalidUpdate = {
				price: 24000,
			};

			const result = UpdateCarSchema.safeParse(invalidUpdate);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].path).toContain("id");
			}
		});

		it("should allow updating only the name", () => {
			const nameUpdate = {
				id: "some-uuid",
				name: "Updated Name",
			};

			const result = UpdateCarSchema.safeParse(nameUpdate);
			expect(result.success).toBe(true);
		});
	});
});
