import { env } from "@/config/env";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function main() {
	console.log("🌱 Seeding database...");

	if (process.env.NODE_ENV !== "production") {
		// Only clear data in non-production
		console.log("🧹 Clearing existing database data...");
		// Delete in correct order to respect foreign key constraints
		await prisma.user.deleteMany();
	}

	const adminEmail = env.SEED_ADMIN_EMAIL || "admin@example.com";
	const adminPassword = env.SEED_ADMIN_PASSWORD || "admin123!";

	// Check if admin already exists
	const existingAdmin = await prisma.user.findUnique({
		where: { email: adminEmail },
	});

	if (existingAdmin) {
		console.log("✅ Admin already exists, skipping creation");
		return;
	}

	// ==================== ADMIN ====================
	console.log("👥 Creating admin...");

	// Create Admin User
	const admin = await auth.api.signUpEmail({
		body: {
			email: adminEmail,
			password: adminPassword,
			name: "System Administrator",
		},
	});

	console.log("✅ Admin created:", admin.user.id);

	// Update role directly in database instead of using auth.api.setRole
	await prisma.user.update({
		where: {
			id: admin.user.id,
		},
		data: {
			emailVerified: true,
		},
	});

	console.log("✅ Admin role set to 'admin'");

	console.log("✅ Seeding complete!");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error("❌ Seeding error:", e);
		await prisma.$disconnect();
		process.exit(1);
	});
