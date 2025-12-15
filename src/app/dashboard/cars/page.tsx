<<<<<<< HEAD
// app/dashboard/cars/page.tsx
import {
	CarFront,
	CheckCircle,
	Clock,
	Eye,
	PlusCircle,
	Wrench,
	XCircle,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { generateDummyCars } from "@/features/cars/data";

export const metadata: Metadata = {
	title: "Cars Inventory",
	description: "Manage your car inventory",
};

export default async function CarsPage() {
	const cars = generateDummyCars(24);

	const getStatusVariant = (status: string) => {
		switch (status) {
			case "AVAILABLE":
				return "success";
			case "SOLD":
				return "destructive";
			case "RESERVED":
				return "default";
			case "PENDING":
				return "default";
			case "IN_MAINTENANCE":
				return "default";
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
			case "IN_MAINTENANCE":
				return <Wrench className="h-3 w-3" />;
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

	const getYearFromCarName = (name: string) => {
		const yearMatch = name.match(/\b(20\d{2})\b/);
		return yearMatch ? yearMatch[1] : "2025";
	};

	return (
		<div className="container mx-auto px-4 py-6">
			{/* HEADER */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Car Inventory</h1>
					<p className="text-muted-foreground mt-2">
						Manage your vehicle collection ({cars.length} cars)
					</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" className="gap-2" asChild>
						<Link href="/dashboard/cars">
							<span className="text-xs">Using Dummy Data</span>
						</Link>
					</Button>
					<Button asChild className="gap-2">
						<Link href="/dashboard/cars/new">
							<PlusCircle className="h-4 w-4" />
							Add New Car
						</Link>
					</Button>
				</div>
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
									<Image
										src={car.photos[0].url}
										alt={car.name}
										width={400}
										height={256}
										className="h-full w-full object-cover transition-transform duration-300"
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
										{car.status.replace("_", " ")}
									</Badge>
								</div>

								{/* Year Badge */}
								<div className="absolute top-3 right-3">
									<Badge
										variant="outline"
										className="bg-background/80 backdrop-blur-sm"
									>
										{getYearFromCarName(car.name)}
									</Badge>
								</div>
							</div>

							<CardContent className="px-6 grow">
								<div className="space-y-4">
									<div>
										<h3 className="font-semibold text-lg line-clamp-1 mb-1">
											{car.name}
										</h3>
										<div className="flex items-center gap-2">
											<div className="flex items-center gap-1">
												<div
													className="h-3 w-3 rounded-full border"
													style={{ backgroundColor: car.color?.toLowerCase() }}
												/>
												<span className="text-sm text-muted-foreground">
													{car.color || "N/A"}
												</span>
											</div>
										</div>
									</div>

									<Separator />

									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium text-muted-foreground">
												Price
											</span>
											<div className="flex items-center gap-1">
												<span className="font-bold text-lg">
													{formatPrice(car.price)}
												</span>
											</div>
										</div>

										{car.mileage && (
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium text-muted-foreground">
													VIN
												</span>
												<span className="font-medium">
													{car.vin?.slice(-6)}
												</span>
											</div>
										)}
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
=======
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import ContentWrapper from "@/components/shared/content-wrapper";
import AddCarDialog from "@/features/cars/components/add-car-dialog";
import CarTable from "@/features/cars/components/car-table";
import { getCarsQueryOptions } from "@/features/cars/queries/use-cars";

export default async function Page() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery(getCarsQueryOptions);

	return (
		<ContentWrapper
			title="Car Management"
			description="Manage your cars and their information"
			addButton={<AddCarDialog />}
		>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<CarTable />
			</HydrationBoundary>
		</ContentWrapper>
>>>>>>> dev
	);
}
