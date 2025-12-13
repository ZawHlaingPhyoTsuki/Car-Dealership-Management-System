// seed.ts
import { faker } from "@faker-js/faker";
import {
	type CarShare,
	CarStatus,
	ExpenseCategory,
} from "@/app/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Helper functions for unique values
function generateUniqueEmails(count: number): string[] {
	const emails = new Set<string>();
	while (emails.size < count) {
		emails.add(faker.internet.email().toLowerCase());
	}
	return Array.from(emails);
}

function generateUniquePhones(count: number): string[] {
	const phones = new Set<string>();
	while (phones.size < count) {
		phones.add(faker.phone.number());
	}
	return Array.from(phones);
}

function generateUniqueVINs(count: number): string[] {
	const vins = new Set<string>();
	while (vins.size < count) {
		vins.add(faker.vehicle.vin());
	}
	return Array.from(vins);
}

async function main() {
	console.log("🌱 Starting database seeding...");

	if (
		process.env.NODE_ENV === "production" &&
		process.env.ALLOW_PROD_SEED !== "true"
	) {
		throw new Error(
			"Refusing to run seed in production without ALLOW_PROD_SEED=true",
		);
	}

	// Clear existing seed data in non-production
	if (process.env.NODE_ENV !== "production") {
		console.log("🧹 Clearing existing seed data...");

		// Delete in correct order to respect foreign key constraints
		await prisma.verification.deleteMany();
		await prisma.session.deleteMany();
		await prisma.account.deleteMany();
		await prisma.photo.deleteMany();
		await prisma.expense.deleteMany();
		await prisma.carShare.deleteMany();
		await prisma.car.deleteMany();
		await prisma.shareholder.deleteMany();
		await prisma.employee.deleteMany();
		await prisma.user.deleteMany();

		console.log("✅ All seed data cleared");
	}

	// ==================== ADMIN USER ====================
	const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
	const adminPassword = process.env.SEED_ADMIN_PASSWORD || "admin123!";

	// Check if admin already exists
	const existingAdmin = await prisma.user.findUnique({
		where: { email: adminEmail },
	});

	if (!existingAdmin) {
		console.log("👥 Creating admin user...");
		try {
			const admin = await auth.api.signUpEmail({
				body: {
					email: adminEmail,
					password: adminPassword,
					name: "System Administrator",
				},
			});

			await prisma.user.update({
				where: { id: admin.user.id },
				data: { emailVerified: true },
			});

			console.log("✅ Admin user created");
		} catch (error) {
			console.log("⚠️ Admin creation error:", error);
			throw error;
		}
	} else {
		console.log("✅ Admin user already exists");
	}

	// ==================== SHAREHOLDERS ====================
	console.log("👥 Creating shareholders...");
	const shareholderPhones = generateUniquePhones(100);
	const shareholdersData = Array.from({ length: 100 }, (_, i) => ({
		id: faker.string.uuid(),
		name: faker.company.name(),
		phone: shareholderPhones[i],
		email: faker.internet.email(),
		notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : null,
		createdAt: faker.date.past({ years: 3 }),
		updatedAt: faker.date.recent(),
	}));

	await prisma.shareholder.createMany({
		data: shareholdersData,
		skipDuplicates: true,
	});
	console.log(`✅ ${shareholdersData.length} shareholders created`);

	// Get shareholder IDs for later use
	const shareholderIds = shareholdersData.map((s) => s.id);

	// ==================== EMPLOYEES ====================
	console.log("👔 Creating employees...");
	const employeeEmails = generateUniqueEmails(100);
	const employeePhones = generateUniquePhones(100);

	const employeesData = Array.from({ length: 100 }, (_, i) => ({
		id: faker.string.uuid(),
		name: faker.person.fullName(),
		email: employeeEmails[i],
		position: faker.person.jobTitle(),
		phone: employeePhones[i],
		address: faker.datatype.boolean(0.8)
			? faker.location.streetAddress()
			: null,
		salary: faker.number.int({ min: 20000, max: 150000 }),
		startDate: faker.date.past({ years: 5 }),
		createdAt: faker.date.past({ years: 5 }),
		updatedAt: faker.date.recent(),
		deletedAt: faker.datatype.boolean(0.1) ? faker.date.recent() : null,
	}));

	await prisma.employee.createMany({
		data: employeesData,
		skipDuplicates: true,
	});
	console.log(`✅ ${employeesData.length} employees created`);

	// Get employee IDs for expenses
	const employeeIds = employeesData.map((e) => e.id);

	// ==================== CARS ====================
	console.log("🚗 Creating cars...");
	const carVINs = generateUniqueVINs(100);
	const carMakes = [
		"Toyota",
		"Honda",
		"Ford",
		"BMW",
		"Mercedes",
		"Audi",
		"Tesla",
		"Nissan",
		"Hyundai",
		"Kia",
		"Volkswagen",
		"Chevrolet",
		"Subaru",
		"Mazda",
		"Lexus",
	];
	const carModels = [
		"Camry",
		"Accord",
		"Mustang",
		"3 Series",
		"C-Class",
		"A4",
		"Model 3",
		"Altima",
		"Elantra",
		"Soul",
		"Golf",
		"Malibu",
		"Outback",
		"CX-5",
		"RX 350",
	];
	const colors = [
		"Red",
		"Blue",
		"Black",
		"White",
		"Silver",
		"Gray",
		"Green",
		"Yellow",
	];

	const carsData = Array.from({ length: 100 }, (_, i) => {
		const isSold = faker.datatype.boolean(0.3); // 30% sold
		const purchaseDate = faker.date.past({ years: 2 });
		const addedAt = faker.date.between({
			from: purchaseDate,
			to: new Date(),
		});
		const soldAt = isSold
			? faker.date.between({
					from: addedAt,
					to: new Date(),
				})
			: null;

		return {
			id: faker.string.uuid(),
			name: `${carMakes[i % carMakes.length]} ${carModels[i % carModels.length]} ${faker.number.int({ min: 2015, max: 2025 })}`,
			price: faker.number.int({ min: 5000, max: 80000 }),
			purchasePrice: faker.number.int({ min: 3000, max: 60000 }),
			purchaseDate: purchaseDate,
			color: colors[i % colors.length],
			mileage: faker.number.int({ min: 0, max: 150000 }),
			mileageUnit: faker.helpers.arrayElement(["km", "miles"]),
			vin: carVINs[i],
			notes: faker.datatype.boolean(0.4) ? faker.lorem.sentence() : null,
			status: isSold
				? CarStatus.SOLD
				: faker.helpers.arrayElement([
						CarStatus.AVAILABLE,
						CarStatus.AVAILABLE,
						CarStatus.AVAILABLE,
						CarStatus.IN_MAINTENANCE,
						CarStatus.RESERVED,
					]),
			addedAt: addedAt,
			soldAt: soldAt,
			buyerName: isSold ? faker.person.fullName() : null,
			buyerPhone: isSold ? faker.phone.number() : null,
			buyerEmail: isSold ? faker.internet.email() : null,
			salePrice: isSold ? faker.number.int({ min: 5500, max: 85000 }) : null,
			saleNotes: isSold
				? faker.helpers.arrayElement(["Cash", "Financing", "Trade-in", "Lease"])
				: null,
			createdAt: purchaseDate,
			updatedAt: faker.date.recent(),
			deletedAt: faker.datatype.boolean(0.05) ? faker.date.recent() : null,
		};
	});

	await prisma.car.createMany({
		data: carsData,
		skipDuplicates: true,
	});
	console.log(`✅ ${carsData.length} cars created`);

	// Get car IDs for expenses, photos, and shares
	const carIds = carsData.map((c) => c.id);

	// ==================== EXPENSES ====================
	console.log("💰 Creating expenses...");
	// Use the actual ExpenseCategory enum values
	const expenseCategories = [
		ExpenseCategory.REPAIRS,
		ExpenseCategory.TRANSPORT,
		ExpenseCategory.AUCTION_FEES,
		ExpenseCategory.CLEANING_DETAILING,
		ExpenseCategory.UTILITIES,
		ExpenseCategory.RENT,
		ExpenseCategory.SALARIES,
		ExpenseCategory.MARKETING,
		ExpenseCategory.OFFICE_SUPPLIES,
		ExpenseCategory.OTHER,
	];

	const expensesData = Array.from({ length: 100 }, (_, i) => {
		const isCarExpense = faker.datatype.boolean(0.6); // 60% are car-specific
		const hasPaidTo = faker.datatype.boolean(0.4); // 40% paid to employees

		return {
			id: faker.string.uuid(),
			amount: faker.number.int({ min: 50, max: 10000 }),
			notes: faker.lorem.sentence(),
			category: expenseCategories[i % expenseCategories.length],
			date: faker.date.past({ years: 1 }),
			carId: isCarExpense ? faker.helpers.arrayElement(carIds) : null,
			paidToId: hasPaidTo ? faker.helpers.arrayElement(employeeIds) : null,
			createdAt: faker.date.past({ years: 1 }),
			updatedAt: faker.date.recent(),
			deletedAt: faker.datatype.boolean(0.05) ? faker.date.recent() : null,
		};
	});

	await prisma.expense.createMany({
		data: expensesData,
		skipDuplicates: true,
	});
	console.log(`✅ ${expensesData.length} expenses created`);

	// ==================== PHOTOS ====================
	console.log("📸 Creating photos...");
	const photosData = Array.from({ length: 100 }, (_, i) => {
		// Distribute photos among cars (some cars have multiple photos)
		const carId = faker.helpers.arrayElement(carIds);

		return {
			id: faker.string.uuid(),
			url: faker.image.url({
				width: 800,
				height: 600,
			}),
			publicId: `photo_${faker.string.alphanumeric(10)}`,
			alt: faker.lorem.words(3),
			order: i % 5, // 0-4 for ordering
			carId: carId,
			createdAt: faker.date.past({ years: 1 }),
			deletedAt: faker.datatype.boolean(0.05) ? faker.date.recent() : null,
		};
	});

	await prisma.photo.createMany({
		data: photosData,
		skipDuplicates: true,
	});
	console.log(`✅ ${photosData.length} photos created`);

	// ==================== CAR SHARES ====================
	console.log("🤝 Creating car shares...");
	const carSharesData: CarShare[] = [];
	const uniqueCombos = new Set<string>();

	// Create shares for cars (2-5 shareholders per car)
	for (const carId of carIds.slice(0, 50)) {
		// 50 cars have shares
		const numShares = faker.number.int({ min: 2, max: 5 });
		const selectedShareholders = faker.helpers.arrayElements(
			shareholderIds,
			numShares,
		);

		// Ensure total percentage doesn't exceed 100%
		let remainingPercentage = 100;

		selectedShareholders.forEach((shareholderId, index) => {
			const isLast = index === selectedShareholders.length - 1;
			const percentage = isLast
				? remainingPercentage
				: faker.number.int({
						min: 10,
						max: Math.min(
							remainingPercentage -
								10 * (selectedShareholders.length - index - 1),
							50,
						),
					});

			remainingPercentage -= percentage;

			const comboKey = `${carId}_${shareholderId}`;
			if (!uniqueCombos.has(comboKey)) {
				uniqueCombos.add(comboKey);

				carSharesData.push({
					id: faker.string.uuid(),
					carId,
					shareholderId,
					percentage,
					amount: faker.number.int({ min: 1000, max: 20000 }),
					createdAt: faker.date.past({ years: 1 }),
					updatedAt: faker.date.recent(),
				});
			}
		});
	}

	await prisma.carShare.createMany({
		data: carSharesData,
		skipDuplicates: true,
	});
	console.log(`✅ ${carSharesData.length} car shares created`);

	console.log("🎉 Seeding completed successfully!");
}

main()
	.then(async () => {
		await prisma.$disconnect();
		process.exit(0);
	})
	.catch(async (e) => {
		console.error("❌ Seeding error:", e);
		await prisma.$disconnect();
		process.exit(1);
	});
