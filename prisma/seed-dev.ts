/** biome-ignore-all lint/style/noNonNullAssertion: <!> */
import { faker } from "@faker-js/faker";
import { CarStatus, type Prisma } from "@/app/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
		licenses.add(faker.vehicle.vrm());
	}
	return Array.from(licenses);
}

async function main() {
	console.log("🌱 Seeding database...");

	if (
		process.env.NODE_ENV === "production" &&
		process.env.ALLOW_PROD_SEED !== "true"
	) {
		throw new Error("❌ Production seeding is disabled");
	}

	// ================= CLEAR DATA =================
	await prisma.expense.deleteMany();
	await prisma.expenseCategory.deleteMany();
	await prisma.photo.deleteMany();
	await prisma.car.deleteMany();
	await prisma.shareholder.deleteMany();
	await prisma.employee.deleteMany();

	console.log("🧹 Database cleared");

	// ==================== ADMIN USER ====================
	const adminEmail = process.env.SEED_ADMIN_EMAIL!;
	const adminPassword = process.env.SEED_ADMIN_PASSWORD!;

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
			console.error("❌ Failed to create admin user", error);
		}
	}
	// ================= EXPENSE CATEGORIES =================
	const categories = [
		"Fuel",
		"Maintenance",
		"Insurance",
		"Registration",
		"Cleaning",
		"Repairs",
		"Parking",
	];

	await prisma.expenseCategory.createMany({
		data: categories.map((name) => ({ name })),
		skipDuplicates: true,
	});

	const expenseCategories = await prisma.expenseCategory.findMany();

	// ================= SHAREHOLDERS =================
	const shareholderPhones = generateUniquePhones(30);

	await prisma.shareholder.createMany({
		data: shareholderPhones.map((phone) => ({
			name: faker.person.fullName(),
			phone,
			notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : null,
		})),
	});

	const shareholders = await prisma.shareholder.findMany();

	// ================= EMPLOYEES =================
	await prisma.employee.createMany({
		data: Array.from({ length: 20 }).map(() => ({
			name: faker.person.fullName(),
			position: faker.person.jobTitle(),
			salary: faker.number.int({ min: 50000, max: 300000 }),
			percentage: faker.number.int({ min: 0, max: 100 }),
			startDate: faker.date.past({ years: 5 }),
		})),
	});

	const employees = await prisma.employee.findMany();

	// ================= CARS =================
	const licenseNumbers = generateUniqueLicenseNumbers(40);

	const cars: Prisma.CarCreateManyInput[] = [];

	for (let i = 0; i < 40; i++) {
		const purchasedPrice = faker.number.int({
			min: 5_000_000,
			max: 50_000_000,
		});
		const totalExpenses = faker.number.int({ min: 500_000, max: 5_000_000 });
		const totalCost = purchasedPrice + totalExpenses;

		const isSold = faker.datatype.boolean(0.4);
		const sellingPrice = isSold
			? faker.number.int({
					min: totalCost + 1_000_000,
					max: totalCost + 10_000_000,
				})
			: 0;

		const profitAmount = isSold ? sellingPrice - totalCost : 0;

		const hasShareholder = faker.datatype.boolean(0.5);
		const shareholder = hasShareholder
			? faker.helpers.arrayElement(shareholders)
			: null;

		const shareholderProfitAmount = hasShareholder
			? Math.floor(profitAmount * 0.4)
			: 0;

		const companyProfitAmount = profitAmount - shareholderProfitAmount;

		cars.push({
			name: faker.vehicle.vehicle(),
			purchasedPrice,
			sellingPrice,
			totalExpenses,
			totalCost,
			profitAmount,
			shareholderProfitAmount,
			companyProfitAmount,
			shareholderInvestedAmount: hasShareholder
				? Math.floor(purchasedPrice * 0.4)
				: 0,
			companyInvestedAmount: hasShareholder
				? purchasedPrice - Math.floor(purchasedPrice * 0.4)
				: purchasedPrice,
			licenseNumber: faker.datatype.boolean(0.9) ? licenseNumbers[i] : null,
			status: isSold ? CarStatus.SOLD : CarStatus.AVAILABLE,
			soldAt: isSold ? faker.date.past({ years: 1 }) : null,
			shareholderId: shareholder?.id ?? null,
		});
	}

	await prisma.car.createMany({ data: cars });

	const createdCars = await prisma.car.findMany();

	// ================= EXPENSES =================
	await prisma.expense.createMany({
		data: Array.from({ length: 80 }).map(() => ({
			amount: faker.number.int({ min: 50_000, max: 2_000_000 }),
			notes: faker.lorem.sentence(),
			date: faker.date.past({ years: 1 }),
			categoryId: faker.helpers.arrayElement(expenseCategories).id,
			carId: faker.datatype.boolean(0.7)
				? faker.helpers.arrayElement(createdCars).id
				: null,
			paidToId: faker.datatype.boolean(0.4)
				? faker.helpers.arrayElement(employees).id
				: null,
		})),
	});

	console.log("✅ Seeding completed successfully");
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
