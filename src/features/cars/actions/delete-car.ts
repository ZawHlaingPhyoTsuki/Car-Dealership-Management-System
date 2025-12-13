"use server";

import prisma from "@/lib/prisma";

export const deleteCar = async (id: string) => {
	try {
		const car = await prisma.car.update({
			where: { id },
			data: {
				deletedAt: new Date(),
			},
		});

		return car;
	} catch (error) {
		console.error("Failed to delete car:", error);
		throw new Error("Failed to delete car");
	}
};
