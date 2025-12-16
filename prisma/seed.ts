import { faker } from "@faker-js/faker";
import { CarStatus, type Prisma } from "@/app/generated/prisma/client";
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

function generateUniqueLicenseNumbers(count: number): string[] {
	const licenses = new Set<string>();
	while (licenses.size < count) {
		licenses.add(faker.vehicle.vrm()); // Vehicle Registration Mark (license plate)
	}
	return Array.from(licenses);
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
		await prisma.expense.deleteMany();
		await prisma.expenseCategory.deleteMany();
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

	// ==================== EXPENSE CATEGORIES ====================
	console.log("📊 Creating expense categories...");

	const expenseCategoryNames = [
		"Fuel",
		"Maintenance",
		"Insurance",
		"Registration",
		"Cleaning",
		"Repairs",
		"Parking",
		"Tolls",
		"Utilities",
		"Office",
	];

	// Create expense categories first
	await prisma.expenseCategory.createMany({
		data: expenseCategoryNames.map((name) => ({
			name,
			createdAt: new Date(),
			updatedAt: new Date(),
		})),
		skipDuplicates: true,
	});

	// Get category IDs for later use
	const expenseCategories = await prisma.expenseCategory.findMany();
	console.log(`✅ ${expenseCategories.length} expense categories created`);

	// ==================== SHAREHOLDERS ====================
	console.log("👥 Creating shareholders...");
	const shareholderEmails = generateUniqueEmails(100);
	const shareholderPhones = generateUniquePhones(100);

	const shareholdersData = Array.from(
		{ length: 100 },
		(_, i) =>
			({
				name: faker.person.fullName(),
				phone: shareholderPhones[i],
				email: shareholderEmails[i],
				notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : null,
				createdAt: faker.date.past({ years: 3 }),
				updatedAt: faker.date.recent(),
			}) as Prisma.ShareholderCreateInput,
	);

	await prisma.shareholder.createMany({
		data: shareholdersData,
		skipDuplicates: true,
	});
	console.log(`✅ ${shareholdersData.length} shareholders created`);

	// Get shareholder IDs for later use
	const shareholders = await prisma.shareholder.findMany();
	const shareholderIds = shareholders.map((s) => s.id);

	// ==================== EMPLOYEES ====================
	console.log("👔 Creating employees...");

	const employeesData = Array.from(
		{ length: 100 },
		(_, _i) =>
			({
				name: faker.person.fullName(),
				position: faker.person.jobTitle(),
				percentage: faker.number.int({ min: 1, max: 100 }),
				salary: faker.number.int({ min: 20000, max: 150000 }),
				startDate: faker.date.past({ years: 5 }),
				createdAt: faker.date.past({ years: 5 }),
				updatedAt: faker.date.recent(),
				deletedAt: faker.datatype.boolean(0.1) ? faker.date.recent() : null,
			}) as Prisma.EmployeeCreateInput,
	);

	await prisma.employee.createMany({
		data: employeesData,
		skipDuplicates: true,
	});
	console.log(`✅ ${employeesData.length} employees created`);

	// Get employee IDs for expenses
	const employees = await prisma.employee.findMany();
	const employeeIds = employees.map((e) => e.id);

	// ==================== CARS ====================
	console.log("🚗 Creating cars...");
	const licenseNumbers = generateUniqueLicenseNumbers(100);
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
		"Orange",
		"Purple",
	];

	// ==================== CARS ====================
	console.log("🚗 Creating cars...");

	const carsData: Prisma.CarCreateManyInput[] = [];

	for (let i = 0; i < 100; i++) {
		const isSold = faker.datatype.boolean(0.3);
		const createdAt = faker.date.past({ years: 2 });

		const price = isSold
			? faker.number.int({ min: 5500, max: 85000 })
			: faker.number.int({ min: 5000, max: 80000 });

		// Determine if car has shareholder (60% of cars)
		const hasShareholder = faker.datatype.boolean(0.6);
		let shareholderId: string | null = null;
		let shareholderPercentage: number | null = null;
		let investmentAmount: number | null = null;

		if (hasShareholder && shareholderIds.length > 0) {
			shareholderId = faker.helpers.arrayElement(shareholderIds);
			shareholderPercentage = faker.number.int({ min: 10, max: 100 });
			investmentAmount = Math.round(price * (shareholderPercentage / 100));
		}

		carsData.push({
			name: `${carMakes[i % carMakes.length]} ${carModels[i % carModels.length]} ${faker.number.int({ min: 2015, max: 2025 })}`,
			price,
			color: colors[i % colors.length],
			licenseNumber: faker.datatype.boolean(0.9) ? licenseNumbers[i] : null,
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
			soldAt: isSold ? faker.date.past({ years: 2 }) : null,
			shareholderId,
			shareholderPercentage,
			investmentAmount,
			createdAt,
			updatedAt: faker.date.recent(),
			deletedAt: faker.datatype.boolean(0.05) ? faker.date.recent() : null,
		});
	}

	await prisma.car.createMany({
		data: carsData,
		skipDuplicates: true,
	});

	console.log(`✅ ${carsData.length} cars created`);

	// Get car IDs for expenses
	const cars = await prisma.car.findMany();
	const carIds = cars.map((c) => c.id);

	// ==================== EXPENSES ====================
	console.log("💰 Creating expenses...");

	// Create expenses with employee relationships
	const expensesData = Array.from({ length: 100 }, (_, _i) => {
		const isCarExpense = faker.datatype.boolean(0.6); // 60% are car-specific
		const hasPaidTo = faker.datatype.boolean(0.4); // 40% paid to employees

		return {
			amount: faker.number.int({ min: 50, max: 10000 }),
			notes: faker.lorem.sentence(),
			categoryId: faker.helpers.arrayElement(expenseCategories).id,
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
