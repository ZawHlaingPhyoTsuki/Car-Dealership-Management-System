import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "@/config/env";
import prisma from "./prisma";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	secret: env.BETTER_AUTH_SECRET,
	emailAndPassword: {
		enabled: true,
	},
	advanced: {
		disableOriginCheck: process.env.NODE_ENV === "development",
		database: {
			generateId: (options) => {
				if (options.model === "user" || options.model === "users") {
					return false; // Let PostgreSQL serial generate it
				}
				return crypto.randomUUID(); // UUIDs for session, account, verification
			},
		},
	},
});
