import {
	CarFront,
	CheckCircle,
	Clock,
	Eye,
	PlusCircle,
	XCircle,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CarImage from "@/features/cars/components/car-image";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
	title: "Cars Inventory",
	description: "Manage your car inventory",
};

export default async function CarsPage() {
	const cars = await prisma.car.findMany({
		include: {
			photos: {
				orderBy: { order: "asc" },
				take: 1,
			},
		},
		where: {
			deletedAt: null,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const getStatusVariant = (status: string) => {
		switch (status) {
			case "AVAILABLE":
				return "success";
			case "SOLD":
				return "destructive";
			case "RESERVED":
				return "secondary";
			case "PENDING":
				return "outline";
			default:
				return "default";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "AVAILABLE":
				return <CheckCircle className="h-3 w-3" />;
			case "SOLD":
				return <XCircle className="h-3 w-3" />;
			case "RESERVED":
			case "PENDING":
				return <Clock className="h-3 w-3" />;
			default:
				return null;
		}
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(price);
	};

	return (
		<div className="container mx-auto px-4">
			{/* HEADER */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Car Inventory</h1>
					<p className="text-muted-foreground mt-2">
						Manage your vehicle collection
					</p>
				</div>
				<Button asChild className="gap-2">
					<Link href="/dashboard/cars/new">
						<PlusCircle className="h-4 w-4" />
						Add New Car
					</Link>
				</Button>
			</div>

			{/* MAIN CONTENT */}
			{cars.length === 0 ? (
				// EMPTY STATE
				<div className="text-center py-16 border-2 border-dashed rounded-lg">
					<CarFront className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
					<h3 className="text-lg font-semibold mb-2">No cars found</h3>
					<p className="text-muted-foreground mb-6">
						Get started by adding your first car to the inventory
					</p>
					<Button asChild>
						<Link href="/dashboard/cars/new">Add New Car</Link>
					</Button>
				</div>
			) : (
				// CAR GRID
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{cars.map((car) => (
						<Card
							key={car.id}
							className="group overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
						>
							{/* Image Container - Fixed Height */}
							<div className="relative h-64 w-full overflow-hidden bg-muted">
								{car.photos[0] ? (
									<CarImage
										publicId={car.photos[0].publicId || car.photos[0].url}
										alt={car.name}
										width={400}
										height={256}
										className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
									/>
								) : (
									<div className="h-full w-full flex flex-col items-center justify-center bg-linear-to-br from-muted to-muted/50">
										<CarFront className="h-16 w-16 text-muted-foreground/50 mb-2" />
										<span className="text-muted-foreground text-sm">
											No Image Available
										</span>
									</div>
								)}

								{/* Status Badge on Image */}
								<div className="absolute top-3 left-3">
									<Badge
										variant={getStatusVariant(car.status)}
										className="gap-1 shadow-sm"
									>
										{getStatusIcon(car.status)}
										{car.status}
									</Badge>
								</div>
							</div>

							<CardContent className="px-6 grow">
								<div className="space-y-4">
									<div>
										<h3 className="font-semibold text-lg line-clamp-1 mb-1">
											{car.name}
										</h3>
										{/* {car.year && (
											<p className="text-sm text-muted-foreground">
												{car.year}
											</p>
										)} */}
										<p className="text-sm text-muted-foreground">2025</p>
									</div>

									<Separator />

									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium text-muted-foreground">
												Price
											</span>
											<div className="flex items-center gap-1">
												<span className="font-bold text-lg">
													{formatPrice(parseFloat(car.price.toString()))}
												</span>
											</div>
										</div>

										{car.mileage && (
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium text-muted-foreground">
													Mileage
												</span>
												<span className="font-medium">
													{car.mileage.toLocaleString()} mi
												</span>
											</div>
										)}

										{/* {car.fuelType && (
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium text-muted-foreground">
													Fuel
												</span>
												<span className="font-medium capitalize">
													{car.fuelType.toLowerCase()}
												</span>
											</div>
										)} */}
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium text-muted-foreground">
												Fuel
											</span>
											<span className="font-medium capitalize">Petrol</span>
										</div>
									</div>
								</div>
							</CardContent>

							<CardFooter className="p-6 pt-0">
								<Button asChild variant="outline" className="w-full gap-2">
									<Link href={`/dashboard/cars/${car.id}`}>
										<Eye className="h-4 w-4" />
										View Details
									</Link>
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
