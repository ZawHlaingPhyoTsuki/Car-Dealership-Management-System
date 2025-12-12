import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Create car with photos
		const car = await prisma.car.create({
			data: {
				name: body.name,
				price: body.price,
				color: body.color,
				mileage: body.mileage,
				mileageUnit: "miles",
				notes: body.notes,
				status: "AVAILABLE",
				photos: {
					create: body.photos.map(
						(
							photo: {
								url: string;
								publicId: string;
								alt: string;
								order: number;
							},
							index: number,
						) => ({
							url: photo.url,
							publicId: photo.publicId,
							alt: `${body.name} - Photo ${index + 1}`,
							order: index,
						}),
					),
				},
			},
			include: {
				photos: true,
			},
		});

		return NextResponse.json(car, { status: 201 });
	} catch (error) {
		console.error("Error creating car:", error);
		return NextResponse.json(
			{ error: "Failed to create car" },
			{ status: 500 },
		);
	}
}
