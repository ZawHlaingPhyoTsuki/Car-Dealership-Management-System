// app/dashboard/cars/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Camera,
	Car,
	DollarSign,
	Fuel,
	Gauge,
	Info,
	Palette,
	Plus,
	Upload,
	X,
	Calendar,
	FileText,
	Tag,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldGroup,
	FieldLabel,
	FieldSet,
	FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import Image from "next/image";

export default function NewCarPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);

	// Form state
	const [formData, setFormData] = useState({
		name: "",
		price: "",
		purchasePrice: "",
		purchaseDate: "",
		color: "",
		mileage: "",
		mileageUnit: "miles",
		vin: "",
		notes: "",
		status: "AVAILABLE",
		fuelType: "Petrol",
		hasPurchaseInfo: false,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	// Handle image upload simulation
	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const newImages: string[] = [];
		for (
			let i = 0;
			i < Math.min(files.length, 5 - uploadedImages.length);
			i++
		) {
			const file = files[i];
			const reader = new FileReader();
			reader.onloadend = () => {
				if (reader.result) {
					newImages.push(reader.result as string);
					if (
						newImages.length ===
						Math.min(files.length, 5 - uploadedImages.length)
					) {
						setUploadedImages((prev) => [...prev, ...newImages]);
						toast.success(`${newImages.length} image(s) uploaded`);
					}
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const removeImage = (index: number) => {
		setUploadedImages((prev) => prev.filter((_, i) => i !== index));
		toast.info("Image removed");
	};

	// Handle form input changes
	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));

		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	// Validate form
	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Car name is required";
		}

		if (!formData.price) {
			newErrors.price = "Price is required";
		} else if (parseFloat(formData.price) <= 0) {
			newErrors.price = "Price must be greater than 0";
		}

		if (!formData.color.trim()) {
			newErrors.color = "Color is required";
		}

		if (formData.mileage && parseFloat(formData.mileage) < 0) {
			newErrors.mileage = "Mileage cannot be negative";
		}

		if (formData.hasPurchaseInfo) {
			if (formData.purchasePrice && parseFloat(formData.purchasePrice) <= 0) {
				newErrors.purchasePrice = "Purchase price must be greater than 0";
			}
		}

		if (uploadedImages.length === 0) {
			newErrors.images = "At least one image is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			toast.error("Please fix the errors in the form");
			return;
		}

		setLoading(true);

		// Simulate API call
		setTimeout(() => {
			console.log("Form submitted:", {
				...formData,
				price: parseFloat(formData.price),
				purchasePrice: formData.purchasePrice
					? parseFloat(formData.purchasePrice)
					: undefined,
				mileage: formData.mileage ? parseFloat(formData.mileage) : undefined,
				images: uploadedImages.length,
			});

			toast.success("Car added successfully!");
			setLoading(false);

			// Redirect to cars list
			setTimeout(() => {
				router.push("/dashboard/cars");
			}, 1000);
		}, 1500);
	};

	// Calculate profit if purchase price exists
	const profit =
		formData.purchasePrice && formData.price
			? parseFloat(formData.price) - parseFloat(formData.purchasePrice)
			: 0;

	return (
		<div className="container mx-auto px-4">
			<div className="mb-8">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-lg bg-primary/10">
						<Car className="h-6 w-6 text-primary" />
					</div>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Add New Car</h1>
						<p className="text-muted-foreground mt-1">
							Fill in the details to add a new vehicle to your inventory
						</p>
					</div>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-8">
				{/* Images Section */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Camera className="h-5 w-5" />
							Car Images
						</CardTitle>
						<CardDescription>
							Upload up to 5 clear images of the vehicle
						</CardDescription>
					</CardHeader>
					<CardContent>
						<FieldSet>
							<FieldGroup className="space-y-4">
								<Field>
									<div className="space-y-3">
										{/* File upload button */}
										<div className="flex items-center gap-3">
											<input
												type="file"
												id="car-images"
												accept="image/*"
												multiple
												onChange={handleImageUpload}
												disabled={uploadedImages.length >= 5}
												className="hidden"
											/>

											<Button
												type="button"
												variant="outline"
												onClick={() =>
													document.getElementById("car-images")?.click()
												}
												disabled={uploadedImages.length >= 5}
												className="gap-2"
											>
												<Upload className="h-4 w-4" />
												Select Images
											</Button>

											<span className="text-sm text-muted-foreground">
												Up to {5 - uploadedImages.length} more images
											</span>
										</div>

										{/* Image requirements */}
										<div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
											<p className="font-medium mb-1">Image Requirements:</p>
											<ul className="list-disc list-inside space-y-1 text-xs">
												<li>PNG, JPG, or WEBP format</li>
												<li>Maximum 5MB per image</li>
												<li>At least 1 image required</li>
											</ul>
										</div>
									</div>

									{/* Image count badge */}
									<div className="mt-3 flex items-center gap-2">
										<Badge
											variant={
												uploadedImages.length === 0
													? "destructive"
													: uploadedImages.length >= 5
														? "default"
														: "outline"
											}
										>
											{uploadedImages.length} / 5 images
										</Badge>
										{uploadedImages.length === 0 && (
											<span className="text-xs text-destructive font-medium">
												At least one image is required
											</span>
										)}
									</div>

									{errors.images && (
										<FieldError className="text-sm mt-2">
											{errors.images}
										</FieldError>
									)}
								</Field>

								{/* Image previews */}
								{uploadedImages.length > 0 && (
									<Field>
										<FieldLabel>Uploaded Images</FieldLabel>
										<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
											{uploadedImages.map((img, index) => (
												<div key={img} className="relative group">
													<div className="aspect-video overflow-hidden rounded-lg border bg-gray-50">
														<Image
															width={500}
															height={500}
															src={img}
															alt={`Car image ${index + 1}`}
															className="h-full w-full object-cover"
														/>
													</div>
													<Button
														type="button"
														variant="destructive"
														size="icon"
														className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
														onClick={() => removeImage(index)}
													>
														<X className="h-3 w-3" />
													</Button>
													<div className="absolute bottom-1 left-1">
														<Badge
															variant="secondary"
															className="text-xs px-1.5 py-0.5"
														>
															{index === 0 ? "Main" : index + 1}
														</Badge>
													</div>
												</div>
											))}
										</div>
									</Field>
								)}
							</FieldGroup>
						</FieldSet>
					</CardContent>
				</Card>

				{/* Basic Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Info className="h-5 w-5" />
							Basic Information
						</CardTitle>
						<CardDescription>
							Essential details about the vehicle
						</CardDescription>
					</CardHeader>
					<CardContent>
						<FieldSet>
							<FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Car Name */}
								<Field>
									<FieldLabel className="flex items-center gap-2">
										<Tag className="h-4 w-4" />
										Car Name *
									</FieldLabel>
									<Input
										placeholder="Toyota Camry 2023"
										value={formData.name}
										onChange={(e) => handleInputChange("name", e.target.value)}
										className={errors.name ? "border-destructive" : ""}
									/>
									{errors.name && (
										<FieldError className="text-sm">{errors.name}</FieldError>
									)}
								</Field>

								{/* Color */}
								<Field>
									<FieldLabel className="flex items-center gap-2">
										<Palette className="h-4 w-4" />
										Color *
									</FieldLabel>
									<Input
										placeholder="Red, Blue, Black, etc."
										value={formData.color}
										onChange={(e) => handleInputChange("color", e.target.value)}
										className={errors.color ? "border-destructive" : ""}
									/>
									{errors.color && (
										<FieldError className="text-sm">{errors.color}</FieldError>
									)}
								</Field>

								{/* Price */}
								<Field>
									<FieldLabel className="flex items-center gap-2">
										<DollarSign className="h-4 w-4" />
										Sale Price ($) *
									</FieldLabel>
									<Input
										type="number"
										placeholder="25000"
										value={formData.price}
										onChange={(e) => handleInputChange("price", e.target.value)}
										className={errors.price ? "border-destructive" : ""}
									/>
									{errors.price && (
										<FieldError className="text-sm">{errors.price}</FieldError>
									)}
								</Field>

								{/* Status */}
								<Field>
									<FieldLabel>Status *</FieldLabel>
									<Select
										value={formData.status}
										onValueChange={(value) =>
											handleInputChange("status", value)
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="AVAILABLE">Available</SelectItem>
											<SelectItem value="RESERVED">Reserved</SelectItem>
											<SelectItem value="IN_MAINTENANCE">
												In Maintenance
											</SelectItem>
										</SelectContent>
									</Select>
								</Field>

								{/* Mileage */}
								<Field>
									<FieldLabel className="flex items-center gap-2">
										<Gauge className="h-4 w-4" />
										Mileage
									</FieldLabel>
									<div className="flex gap-2">
										<Input
											type="number"
											placeholder="15000"
											value={formData.mileage}
											onChange={(e) =>
												handleInputChange("mileage", e.target.value)
											}
											className={errors.mileage ? "border-destructive" : ""}
										/>
										<Select
											value={formData.mileageUnit}
											onValueChange={(value) =>
												handleInputChange("mileageUnit", value)
											}
										>
											<SelectTrigger className="w-[100px]">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="miles">Miles</SelectItem>
												<SelectItem value="km">Kilometers</SelectItem>
											</SelectContent>
										</Select>
									</div>
									{errors.mileage && (
										<FieldError className="text-sm">
											{errors.mileage}
										</FieldError>
									)}
								</Field>

								{/* VIN */}
								<Field>
									<FieldLabel>VIN (Optional)</FieldLabel>
									<Input
										placeholder="Vehicle Identification Number"
										value={formData.vin}
										onChange={(e) => handleInputChange("vin", e.target.value)}
									/>
								</Field>

								{/* Fuel Type */}
								<Field>
									<FieldLabel className="flex items-center gap-2">
										<Fuel className="h-4 w-4" />
										Fuel Type
									</FieldLabel>
									<Select
										value={formData.fuelType}
										onValueChange={(value) =>
											handleInputChange("fuelType", value)
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Petrol">Petrol</SelectItem>
											<SelectItem value="Diesel">Diesel</SelectItem>
											<SelectItem value="Electric">Electric</SelectItem>
											<SelectItem value="Hybrid">Hybrid</SelectItem>
										</SelectContent>
									</Select>
								</Field>

								{/* Notes */}
								<Field className="md:col-span-2">
									<FieldLabel className="flex items-center gap-2">
										<FileText className="h-4 w-4" />
										Additional Notes
									</FieldLabel>
									<Textarea
										placeholder="Any additional details, features, or condition notes..."
										rows={3}
										value={formData.notes}
										onChange={(e) => handleInputChange("notes", e.target.value)}
									/>
								</Field>
							</FieldGroup>
						</FieldSet>
					</CardContent>
				</Card>

				{/* Purchase Information */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Purchase Information</CardTitle>
								<CardDescription>
									Track purchase details for profit calculation
								</CardDescription>
							</div>
							<Field orientation="horizontal" className="items-center gap-2">
								<Checkbox
									id="hasPurchaseInfo"
									checked={formData.hasPurchaseInfo}
									onCheckedChange={(checked) =>
										handleInputChange("hasPurchaseInfo", checked as boolean)
									}
								/>
								<FieldLabel
									htmlFor="hasPurchaseInfo"
									className="cursor-pointer"
								>
									Include purchase info
								</FieldLabel>
							</Field>
						</div>
					</CardHeader>

					{formData.hasPurchaseInfo && (
						<CardContent>
							<Separator className="mb-6" />
							<FieldSet>
								<FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Purchase Price */}
									<Field>
										<FieldLabel>Purchase Price ($)</FieldLabel>
										<Input
											type="number"
											placeholder="20000"
											value={formData.purchasePrice}
											onChange={(e) =>
												handleInputChange("purchasePrice", e.target.value)
											}
											className={
												errors.purchasePrice ? "border-destructive" : ""
											}
										/>
										{errors.purchasePrice && (
											<FieldError className="text-sm">
												{errors.purchasePrice}
											</FieldError>
										)}
									</Field>

									{/* Purchase Date */}
									<Field>
										<FieldLabel className="flex items-center gap-2">
											<Calendar className="h-4 w-4" />
											Purchase Date
										</FieldLabel>
										<Input
											type="date"
											value={formData.purchaseDate}
											onChange={(e) =>
												handleInputChange("purchaseDate", e.target.value)
											}
										/>
									</Field>
								</FieldGroup>
							</FieldSet>

							{/* Profit Preview */}
							{formData.price && formData.purchasePrice && (
								<div className="mt-6 p-4 rounded-lg bg-muted">
									<div className="flex items-center justify-between">
										<div>
											<p className="font-medium">Estimated Profit</p>
											<p className="text-sm text-muted-foreground">
												Sale price minus purchase price
											</p>
										</div>
										<div
											className={`text-2xl font-bold ${
												profit > 0
													? "text-green-600"
													: profit < 0
														? "text-red-600"
														: "text-gray-600"
											}`}
										>
											${profit.toLocaleString()}
										</div>
									</div>
								</div>
							)}
						</CardContent>
					)}
				</Card>

				{/* Submit Section */}
				<Card>
					<CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
						<div className="text-sm text-muted-foreground space-y-1">
							<div className="flex items-center gap-2">
								<div
									className={`h-2 w-2 rounded-full ${
										uploadedImages.length > 0
											? "bg-green-500"
											: "bg-destructive"
									}`}
								/>
								<span>
									{uploadedImages.length === 0
										? "Upload at least one image"
										: "Ready to submit"}
								</span>
							</div>
							<p className="text-xs">
								{Object.keys(errors).length === 0
									? "All required fields are filled correctly"
									: `${Object.keys(errors).length} error(s) need attention`}
							</p>
						</div>

						<div className="flex gap-3">
							<Button
								type="button"
								variant="outline"
								onClick={() => router.push("/dashboard/cars")}
								disabled={loading}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={loading || uploadedImages.length === 0}
								className="gap-2 min-w-[180px]"
							>
								{loading ? (
									<>
										<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
										Adding Car...
									</>
								) : (
									<>
										<Plus className="h-4 w-4" />
										Add Car to Inventory
									</>
								)}
							</Button>
						</div>
					</CardFooter>
				</Card>
			</form>
		</div>
	);
}
