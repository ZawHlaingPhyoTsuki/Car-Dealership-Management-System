import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function main() {
	// console.log("🧹 Clearing existing seed data...");

	// Delete in correct order to respect foreign key constraints
	// await prisma.verification.deleteMany();
	// await prisma.session.deleteMany();
	// await prisma.account.deleteMany();
	// await prisma.expense.deleteMany();
	// await prisma.expenseCategory.deleteMany();
	// await prisma.car.deleteMany();
	// await prisma.shareholder.deleteMany();
	// await prisma.employee.deleteMany();
	// await prisma.user.deleteMany();

	// console.log("✅ All seed data cleared");

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
