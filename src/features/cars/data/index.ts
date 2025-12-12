// // src/features/cars/data/index.ts
// import { faker } from "@faker-js/faker";

// export const generateDummyCars = (count: number = 20) => {
// 	const statuses = ["AVAILABLE", "SOLD", "RESERVED", "PENDING"];
// 	const colors = ["Red", "Blue", "Black", "White", "Silver", "Gray", "Green"];
// 	const brands = [
// 		"Toyota",
// 		"Honda",
// 		"Ford",
// 		"BMW",
// 		"Mercedes",
// 		"Tesla",
// 		"Audi",
// 		"Chevrolet",
// 	];
// 	const models = [
// 		"Camry",
// 		"Civic",
// 		"F-150",
// 		"3 Series",
// 		"C-Class",
// 		"Model 3",
// 		"A4",
// 		"Silverado",
// 	];

// 	return Array.from({ length: count }, (_, i) => {
// 		const brand = faker.helpers.arrayElement(brands);
// 		const model = faker.helpers.arrayElement(models);
// 		const year = faker.date
// 			.between({ from: "2018-01-01", to: "2024-12-31" })
// 			.getFullYear();
// 		const status = faker.helpers.arrayElement(statuses);
// 		const price = faker.number.int({ min: 20000, max: 80000 }); // Increased min to 20000

// 		return {
// 			id: faker.string.uuid(),
// 			name: `${brand} ${model} ${year}`,
// 			price,
// 			// FIXED: Ensure purchasePrice max is always greater than min
// 			purchasePrice: faker.number.int({
// 				min: Math.max(12000, price - 15000), // Use Math.max to ensure min <= max
// 				max: price - 3000,
// 			}),
// 			purchaseDate: faker.date.past({ years: 2 }),
// 			color: faker.helpers.arrayElement(colors),
// 			mileage: faker.number.int({ min: 5000, max: 80000 }),
// 			mileageUnit: "miles" as const,
// 			vin: faker.vehicle.vin(),
// 			notes: faker.lorem.sentence(),
// 			status: status as "AVAILABLE" | "SOLD" | "RESERVED" | "PENDING",
// 			addedAt: faker.date.recent({ days: 180 }),
// 			soldAt: status === "SOLD" ? faker.date.recent({ days: 30 }) : null,
// 			photos: [
// 				{
// 					id: faker.string.uuid(),
// 					url: "/placeholder.png",
// 					publicId: `car-${i}`,
// 					alt: `${brand} ${model} ${year}`,
// 					order: 0,
// 					carId: "",
// 					createdAt: new Date(),
// 					deletedAt: null,
// 				},
// 			],
// 			createdAt: faker.date.past({ years: 1 }),
// 			updatedAt: faker.date.recent({ days: 30 }),
// 			deletedAt: null,
// 		};
// 	});
// };

import { faker } from "@faker-js/faker";

export interface DummyCar {
	id: string;
	name: string;
	price: number; // Int in Prisma
	purchasePrice: number | null;
	purchaseDate: Date | null;
	color: string | null;
	mileage: number | null;
	mileageUnit: "km" | "miles";
	vin: string | null;
	notes: string | null;
	status: "AVAILABLE" | "SOLD" | "RESERVED" | "PENDING" | "IN_MAINTENANCE";
	addedAt: Date;
	soldAt: Date | null;
	buyerName: string | null;
	buyerPhone: string | null;
	buyerEmail: string | null;
	salePrice: number | null;
	saleNotes: string | null;
	photos: Array<{
		id: string;
		url: string;
		publicId: string | null;
		alt: string | null;
		order: number;
		carId: string | null;
		createdAt: Date;
		deletedAt: Date | null;
	}>;
	expenses: Array<{
		id: string;
		amount: number;
		notes: string;
		category: string;
		date: Date;
		carId: string | null;
		paidToId: string | null;
		createdAt: Date;
		updatedAt: Date;
		deletedAt: Date | null;
	}>;
	shares: Array<{
		id: string;
		carId: string;
		shareholderId: string;
		percentage: number;
		amount: number | null;
		createdAt: Date;
		updatedAt: Date;
	}>;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
}

export const generateDummyCars = (count: number = 20): DummyCar[] => {
	const statuses = [
		"AVAILABLE",
		"SOLD",
		"RESERVED",
		"PENDING",
		"IN_MAINTENANCE",
	] as const;
	const colors = ["Red", "Blue", "Black", "White", "Silver", "Gray", "Green"];
	const brands = [
		"Toyota",
		"Honda",
		"Ford",
		"BMW",
		"Mercedes",
		"Tesla",
		"Audi",
		"Chevrolet",
	];
	const models = [
		"Camry",
		"Civic",
		"F-150",
		"3 Series",
		"C-Class",
		"Model 3",
		"A4",
		"Silverado",
	];
	const expenseCategories = [
		"REPAIRS",
		"TRANSPORT",
		"AUCTION_FEES",
		"CLEANING_DETAILING",
		"UTILITIES",
		"OTHER",
	] as const;

	return Array.from({ length: count }, (_, i) => {
		const brand = faker.helpers.arrayElement(brands);
		const model = faker.helpers.arrayElement(models);
		const year = faker.date
			.between({ from: "2018-01-01", to: "2024-12-31" })
			.getFullYear();
		const status = faker.helpers.arrayElement(statuses);
		const price = faker.number.int({ min: 15000, max: 80000 }); // Int, not Float

		// Calculate purchase price safely
		const purchasePrice = faker.datatype.boolean(0.7)
			? faker.number.int({
					min: Math.max(10000, price - 20000),
					max: price - 5000,
				})
			: null;

		const isSold = status === "SOLD";

		// Generate some expenses for the car
		const expenseCount = faker.number.int({ min: 0, max: 5 });
		const expenses = Array.from({ length: expenseCount }, () => ({
			id: faker.string.uuid(),
			amount: faker.number.int({ min: 100, max: 5000 }),
			notes: faker.lorem.sentence(),
			category: faker.helpers.arrayElement(expenseCategories),
			date: faker.date.past({ years: 1 }),
			carId: null, // Will be set by Prisma
			paidToId: null,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
		}));

		return {
			id: faker.string.uuid(),
			name: `${brand} ${model} ${year}`,
			price,
			purchasePrice,
			purchaseDate: purchasePrice ? faker.date.past({ years: 2 }) : null,
			color: faker.helpers.arrayElement(colors),
			mileage: faker.number.int({ min: 5000, max: 80000 }),
			mileageUnit: "km" as const, // Default in your schema
			vin: faker.vehicle.vin(),
			notes: faker.lorem.paragraph(),
			status,
			addedAt: faker.date.past({ years: 1 }),
			soldAt: isSold ? faker.date.recent({ days: 30 }) : null,
			buyerName: isSold ? faker.person.fullName() : null,
			buyerPhone: isSold ? faker.phone.number() : null,
			buyerEmail: isSold ? faker.internet.email() : null,
			salePrice: isSold
				? price - faker.number.int({ min: 1000, max: 5000 })
				: null,
			saleNotes: isSold ? faker.lorem.sentence() : null,
			photos: [
				{
					id: faker.string.uuid(),
					url: "/placeholder.png",
					publicId: `car-${i}`,
					alt: `${brand} ${model} ${year}`,
					order: 0,
					carId: null,
					createdAt: new Date(),
					deletedAt: null,
				},
			],
			expenses,
			shares: [], // Empty for now, can be populated if needed
			createdAt: faker.date.past({ years: 1 }),
			updatedAt: faker.date.recent({ days: 30 }),
			deletedAt: null,
		};
	});
};
