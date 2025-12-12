import { format } from "date-fns";
import {
	Calendar,
	Car,
	DollarSign,
	FileText,
	Fuel,
	Gauge,
	Mail,
	Palette,
	Phone,
	Users,
} from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CarImageGallery from "@/features/cars/components/car-image-gallery";
import { generateDummyCars } from "@/features/cars/data";

interface CarDetailPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
	const { id } = await params;
	const cars = generateDummyCars();
	const car = cars[3];

	if (!car) {
		notFound();
	}

	const formatCurrency = (amount: number | null | undefined) => {
		if (!amount) return "N/A";
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	const formatDate = (date: Date | null | undefined) => {
		if (!date) return "N/A";
		return format(date, "PPP");
	};

	const getStatusBadge = (status: string) => {
		const statusConfig: Record<
			string,
			{
				label: string;
				variant:
					| "default"
					| "secondary"
					| "destructive"
					| "outline"
					| "success";
			}
		> = {
			AVAILABLE: { label: "Available", variant: "success" },
			SOLD: { label: "Sold", variant: "destructive" },
			RESERVED: { label: "Reserved", variant: "secondary" },
			PENDING: { label: "Pending", variant: "outline" },
			IN_MAINTENANCE: { label: "In Maintenance", variant: "outline" },
		};

		return statusConfig[status] || { label: status, variant: "outline" };
	};

	const status = getStatusBadge(car.status);
	const isSold = car.status === "SOLD";

	return (
		<div className="container mx-auto px-4 py-6">
			{/* Header with actions */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">{car.name}</h1>
					<div className="flex items-center gap-4 mt-2">
						<Badge variant={status.variant}>{status.label}</Badge>
						<span className="text-2xl font-semibold text-primary">
							{formatCurrency(car.price)}
						</span>
					</div>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" disabled={isSold}>
						<Car className="w-4 h-4 mr-2" />
						{isSold ? "Already Sold" : "Mark as Sold"}
					</Button>
					<Button variant="outline">
						<Users className="w-4 h-4 mr-2" />
						Add Shareholder
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left column - Image gallery */}
				<div className="lg:col-span-2">
					<CarImageGallery photos={car.photos} carName={car.name} />
				</div>

				{/* Right column - Details */}
				<div className="space-y-6">
					{/* Quick info card */}
					<Card>
						<CardHeader>
							<CardTitle>Vehicle Information</CardTitle>
							<CardDescription>Basic specifications</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1">
									<div className="flex items-center text-sm text-muted-foreground">
										<Palette className="w-4 h-4 mr-2" />
										Color
									</div>
									<div className="font-medium">{car.color || "N/A"}</div>
								</div>
								<div className="space-y-1">
									<div className="flex items-center text-sm text-muted-foreground">
										<Gauge className="w-4 h-4 mr-2" />
										Mileage
									</div>
									<div className="font-medium">
										{car.mileage
											? `${car.mileage.toLocaleString()} ${car.mileageUnit}`
											: "N/A"}
									</div>
								</div>
								<div className="space-y-1">
									<div className="flex items-center text-sm text-muted-foreground">
										<Calendar className="w-4 h-4 mr-2" />
										Added On
									</div>
									<div className="font-medium">{formatDate(car.addedAt)}</div>
								</div>
								<div className="space-y-1">
									<div className="flex items-center text-sm text-muted-foreground">
										<Fuel className="w-4 h-4 mr-2" />
										VIN
									</div>
									<div className="font-medium font-mono text-sm">
										{car.vin || "N/A"}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Financial details card */}
					<Card>
						<CardHeader>
							<CardTitle>Financial Details</CardTitle>
							<CardDescription>Costs and profit margins</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<span className="text-muted-foreground">Sale Price</span>
									<span className="font-semibold">
										{formatCurrency(car.price)}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-muted-foreground">Purchase Price</span>
									<span className="font-semibold">
										{car.purchasePrice
											? formatCurrency(car.purchasePrice)
											: "N/A"}
									</span>
								</div>

								{car.purchasePrice && (
									<>
										<Separator />
										<div className="flex justify-between items-center">
											<span className="text-muted-foreground">
												Gross Profit
											</span>
											<span
												className={`font-semibold ${
													car.price - car.purchasePrice > 0
														? "text-green-600"
														: "text-red-600"
												}`}
											>
												{formatCurrency(car.price - car.purchasePrice)}
											</span>
										</div>
									</>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Sale information (if sold) */}
					{isSold && (
						<Card>
							<CardHeader>
								<CardTitle>Sale Information</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<div className="flex items-center text-sm text-muted-foreground">
										<Calendar className="w-4 h-4 mr-2" />
										Sold On
									</div>
									<div className="font-medium">
										{car.soldAt ? formatDate(car.soldAt) : "N/A"}
									</div>
								</div>

								{car.salePrice && (
									<div className="space-y-2">
										<div className="flex items-center text-sm text-muted-foreground">
											<DollarSign className="w-4 h-4 mr-2" />
											Final Sale Price
										</div>
										<div className="font-medium">
											{formatCurrency(car.salePrice)}
										</div>
									</div>
								)}

								{(car.buyerName || car.buyerEmail || car.buyerPhone) && (
									<>
										<Separator />
										<div>
											<h4 className="font-medium mb-2">Buyer Details</h4>
											<div className="space-y-2 text-sm">
												{car.buyerName && (
													<div className="flex items-center">
														<span className="text-muted-foreground w-20">
															Name:
														</span>
														<span>{car.buyerName}</span>
													</div>
												)}
												{car.buyerEmail && (
													<div className="flex items-center">
														<Mail className="w-4 h-4 mr-2 text-muted-foreground" />
														<span>{car.buyerEmail}</span>
													</div>
												)}
												{car.buyerPhone && (
													<div className="flex items-center">
														<Phone className="w-4 h-4 mr-2 text-muted-foreground" />
														<span>{car.buyerPhone}</span>
													</div>
												)}
											</div>
										</div>
									</>
								)}
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			{/* Tabs for additional details */}
			<div className="mt-8">
				<Tabs defaultValue="details" className="w-full">
					<TabsList className="grid grid-cols-3 w-full max-w-md">
						<TabsTrigger value="details">Details</TabsTrigger>
						<TabsTrigger value="expenses">Expenses</TabsTrigger>
						<TabsTrigger value="notes">Notes & History</TabsTrigger>
					</TabsList>

					<TabsContent value="details" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Vehicle Specifications</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-4">
										<h4 className="font-semibold">Basic Information</h4>
										<dl className="space-y-3">
											<div className="flex justify-between">
												<dt className="text-muted-foreground">Status</dt>
												<dd>
													<Badge variant={status.variant}>{status.label}</Badge>
												</dd>
											</div>
											<div className="flex justify-between">
												<dt className="text-muted-foreground">Purchase Date</dt>
												<dd>
													{car.purchaseDate
														? formatDate(car.purchaseDate)
														: "N/A"}
												</dd>
											</div>
											<div className="flex justify-between">
												<dt className="text-muted-foreground">Sold Date</dt>
												<dd>
													{car.soldAt ? formatDate(car.soldAt) : "Not sold"}
												</dd>
											</div>
											<div className="flex justify-between">
												<dt className="text-muted-foreground">Mileage Unit</dt>
												<dd>{car.mileageUnit}</dd>
											</div>
										</dl>
									</div>

									<div className="space-y-4">
										<h4 className="font-semibold">Identification</h4>
										<dl className="space-y-3">
											<div className="flex justify-between">
												<dt className="text-muted-foreground">VIN</dt>
												<dd className="font-mono">{car.vin || "N/A"}</dd>
											</div>
											<div className="flex justify-between">
												<dt className="text-muted-foreground">Stock ID</dt>
												<dd className="font-mono">{car.id.slice(0, 8)}</dd>
											</div>
											<div className="flex justify-between">
												<dt className="text-muted-foreground">Created</dt>
												<dd>{formatDate(car.createdAt)}</dd>
											</div>
											<div className="flex justify-between">
												<dt className="text-muted-foreground">Last Updated</dt>
												<dd>{formatDate(car.updatedAt)}</dd>
											</div>
										</dl>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="expenses" className="mt-6">
						<Card>
							<CardHeader>
								<div className="flex justify-between items-center">
									<div>
										<CardTitle>Expenses</CardTitle>
										<CardDescription>
											Costs associated with this vehicle
										</CardDescription>
									</div>
									<Button size="sm" variant="outline">
										Add Expense
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<ScrollArea className="h-[300px]">
									{car.expenses.length > 0 ? (
										<div className="space-y-3">
											{car.expenses.map((expense) => (
												<div
													key={expense.id}
													className="flex items-center justify-between p-3 border rounded-lg"
												>
													<div>
														<div className="font-medium">{expense.notes}</div>
														<div className="text-sm text-muted-foreground">
															{expense.category} • {formatDate(expense.date)}
														</div>
													</div>
													<div className="font-semibold">
														{formatCurrency(expense.amount)}
													</div>
												</div>
											))}
											<div className="pt-4 border-t mt-4">
												<div className="flex justify-between items-center font-semibold">
													<span>Total Expenses</span>
													<span>
														{formatCurrency(
															car.expenses.reduce(
																(sum, exp) => sum + exp.amount,
																0,
															),
														)}
													</span>
												</div>
											</div>
										</div>
									) : (
										<div className="text-center py-8 text-muted-foreground">
											<FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
											<p>No expenses recorded for this vehicle</p>
										</div>
									)}
								</ScrollArea>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="notes" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Notes & History</CardTitle>
								<CardDescription>
									Additional information and maintenance history
								</CardDescription>
							</CardHeader>
							<CardContent>
								{car.notes ? (
									<div className="prose prose-sm max-w-none">
										<p className="whitespace-pre-line">{car.notes}</p>
									</div>
								) : (
									<div className="text-center py-8 text-muted-foreground">
										<FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
										<p>No notes available for this vehicle</p>
									</div>
								)}

								{car.saleNotes && (
									<>
										<Separator className="my-6" />
										<div>
											<h4 className="font-semibold mb-2">Sale Notes</h4>
											<p className="text-sm text-muted-foreground">
												{car.saleNotes}
											</p>
										</div>
									</>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
