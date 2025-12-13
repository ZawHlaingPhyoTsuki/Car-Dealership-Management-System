"use server";

import prisma from "@/lib/prisma";

export async function getCars() {
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
					}
				},
			}
		});
		return cars;
	} catch (error) {
		console.error("Failed to fetch cars:", error);
		throw new Error("Failed to fetch cars");
	}
}

export type Car = Awaited<ReturnType<typeof getCars>>[number];
