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

// Helper function to calculate car totals
function calculateCarTotals(
	purchasedPrice: number,
	expenses: Array<{ amount: number }>,
	sellingPrice: number,
	companyInvestedAmount: number,
	shareholderInvestedAmount: number,
) {
	const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
	const totalCost = purchasedPrice + totalExpenses;
	const profitAmount = sellingPrice > 0 ? sellingPrice - totalCost : 0;

	let companyProfitAmount = 0;
	let shareholderProfitAmount = 0;

	if (profitAmount > 0) {
		const totalInvestment = companyInvestedAmount + shareholderInvestedAmount;
		if (totalInvestment > 0) {
			const companyShare = companyInvestedAmount / totalInvestment;
			companyProfitAmount = Math.round(profitAmount * companyShare);
			shareholderProfitAmount = profitAmount - companyProfitAmount; // Adjust for rounding
		} else {
			// If no investment, profit goes to company
			companyProfitAmount = profitAmount;
		}
	}

	return {
		totalExpenses,
		totalCost,
		profitAmount,
		companyProfitAmount,
		shareholderProfitAmount,
	};
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
	// Note: Photo model no longer exists, so we don't need to delete it
	await prisma.expense.deleteMany();
	await prisma.expenseCategory.deleteMany();
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

	// ================= CARS (without calculated fields) =================
	const licenseNumbers = generateUniqueLicenseNumbers(40);

	const cars: Prisma.CarCreateManyInput[] = [];

	for (let i = 0; i < 40; i++) {
		const purchasedPrice = faker.number.int({
			min: 5_000_000,
			max: 50_000_000,
		});

		const isSold = faker.datatype.boolean(0.4);

		// Only set selling price if car is sold
		const sellingPrice = isSold
			? faker.number.int({
					min: purchasedPrice + 1_000_000,
					max: purchasedPrice + 10_000_000,
				})
			: 0;

		const hasShareholder = faker.datatype.boolean(0.5);
		const shareholder = hasShareholder
			? faker.helpers.arrayElement(shareholders)
			: null;

		const shareholderInvestedAmount = hasShareholder
			? Math.floor(purchasedPrice * 0.4)
			: 0;

		const companyInvestedAmount = hasShareholder
			? purchasedPrice - Math.floor(purchasedPrice * 0.4)
			: purchasedPrice;

		// Randomly decide if car should have an image
		const hasImage = faker.datatype.boolean(0.7);

		cars.push({
			name: faker.vehicle.vehicle(),
			imageUrl: hasImage ? faker.image.url({ width: 1024, height: 768 }) : null,
			imagePublicId: hasImage ? faker.string.uuid() : null,
			purchasedPrice,
			sellingPrice: sellingPrice,
			shareholderInvestedAmount,
			companyInvestedAmount,
			// Note: companyProfitAmount and shareholderProfitAmount are now calculated fields
			// We'll update these after creating expenses
			companyProfitAmount: 0,
			shareholderProfitAmount: 0,
			licenseNumber: faker.datatype.boolean(0.9) ? licenseNumbers[i] : null,
			status: isSold ? CarStatus.SOLD : CarStatus.AVAILABLE,
			soldAt: isSold ? faker.date.past({ years: 1 }) : null,
			shareholderId: shareholder?.id ?? null,
		});
	}

	await prisma.car.createMany({ data: cars });
	const createdCars = await prisma.car.findMany();

	// ================= EXPENSES =================
	// We'll create expenses and immediately calculate totals
	const expensePromises = [];

	for (let i = 0; i < 80; i++) {
		const car = faker.datatype.boolean(0.7)
			? faker.helpers.arrayElement(createdCars)
			: null;

		const expenseData: Prisma.ExpenseCreateInput = {
			amount: faker.number.int({ min: 50_000, max: 2_000_000 }),
			notes: faker.lorem.sentence(),
			date: faker.date.past({ years: 1 }),
			category: {
				connect: { id: faker.helpers.arrayElement(expenseCategories).id },
			},
			paidTo: faker.datatype.boolean(0.4)
				? {
						connect: { id: faker.helpers.arrayElement(employees).id },
					}
				: undefined,
		};

		if (car) {
			expenseData.car = { connect: { id: car.id } };
		}

		expensePromises.push(prisma.expense.create({ data: expenseData }));
	}

	await Promise.all(expensePromises);

	// ================= UPDATE CAR PROFIT CALCULATIONS =================
	console.log("🔢 Updating car profit calculations...");

	// Get all cars with their expenses
	const carsWithExpenses = await prisma.car.findMany({
		include: {
			expenses: true,
		},
	});

	// Update each car with calculated profit amounts
	const updatePromises = carsWithExpenses.map(async (car) => {
		const { companyProfitAmount, shareholderProfitAmount } = calculateCarTotals(
			car.purchasedPrice,
			car.expenses,
			car.sellingPrice,
			car.companyInvestedAmount,
			car.shareholderInvestedAmount,
		);

		// Only update if the car is sold
		if (car.status === CarStatus.SOLD && car.sellingPrice > 0) {
			return prisma.car.update({
				where: { id: car.id },
				data: {
					companyProfitAmount,
					shareholderProfitAmount,
				},
			});
		}

		return Promise.resolve();
	});

	await Promise.all(updatePromises);

	console.log("✅ Seeding completed successfully");
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
