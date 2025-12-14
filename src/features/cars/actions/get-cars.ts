"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getCars() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Unauthorized");
	}

	try {
		const cars = await prisma.car.findMany({
			where: {
				deletedAt: null,
			},
			orderBy: {
				createdAt: "desc",
			},
			include: {
				photos: {
					select: {
						id: true,
						url: true,
						alt: true,
						order: true,
					},
				},
				shareholder: {
					select: {
						id: true,
						name: true,
						email: true,
						phone: true,
						createdAt: true,
					},
				},
			},
		});
		return cars;
	} catch (error) {
		console.error("Failed to fetch cars:", error);
		throw new Error("Failed to fetch cars");
	}
}

export type Car = Awaited<ReturnType<typeof getCars>>[number];
