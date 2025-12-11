"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import ImageUploader from "@/components/cloudinary/image-uploader";

const carSchema = z.object({
	name: z.string().min(1, "Name is required"),
	price: z.string().min(1, "Price is required"),
	color: z.string().optional(),
	mileage: z.string().optional(),
	notes: z.string().optional(),
});

type CarFormData = z.infer<typeof carSchema>;

export default function NewCarPage() {
	const router = useRouter();
	const [photos, setPhotos] = useState<
		Array<{ publicId: string; url: string }>
	>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CarFormData>({
		resolver: zodResolver(carSchema),
	});

	const handleImageUpload = (publicId: string, secureUrl: string) => {
		setPhotos((prev) => [...prev, { publicId, url: secureUrl }]);
	};

	const onSubmit = async (data: CarFormData) => {
		setIsSubmitting(true);

		try {
			const response = await fetch("/api/cars", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...data,
					photos,
					price: parseFloat(data.price),
					mileage: data.mileage ? parseInt(data.mileage, 10) : null,
				}),
			});

			if (!response.ok) throw new Error("Failed to create car");

			toast.success("Car added successfully!");
			router.push("/dashboard/cars");
		} catch (error) {
			console.error("Error creating car:", error);
			toast.error("Failed to create car");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="container mx-auto px-4">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-6 max-w-2xl mx-auto py-6"
			>
				{/* Image Upload Section */}
				<div>
					<label htmlFor="photos" className="block text-sm font-medium mb-2">
						Car Photos *
					</label>
					<ImageUploader
						onUploadSuccess={handleImageUpload}
						maxFiles={5}
						folder="cars"
					/>
				</div>

				{/* Car Details */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label htmlFor="name" className="block text-sm font-medium mb-2">
							Car Name *
						</label>
						<input
							{...register("name")}
							id="name"
							className="w-full px-3 py-2 border rounded-lg"
							placeholder="e.g., Toyota Camry 2023"
						/>
						{errors.name && (
							<p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
						)}
					</div>

					<div>
						<label htmlFor="price" className="block text-sm font-medium mb-2">
							Price ($) *
						</label>
						<input
							{...register("price")}
							id="price"
							type="number"
							step="0.01"
							className="w-full px-3 py-2 border rounded-lg"
							placeholder="e.g., 25000"
						/>
						{errors.price && (
							<p className="text-sm text-red-500 mt-1">
								{errors.price.message}
							</p>
						)}
					</div>

					<div>
						<label htmlFor="color" className="block text-sm font-medium mb-2">
							Color
						</label>
						<input
							{...register("color")}
							id="color"
							className="w-full px-3 py-2 border rounded-lg"
							placeholder="e.g., Red"
						/>
					</div>

					<div>
						<label htmlFor="mileage" className="block text-sm font-medium mb-2">
							Mileage
						</label>
						<input
							{...register("mileage")}
							id="mileage"
							type="number"
							className="w-full px-3 py-2 border rounded-lg"
							placeholder="e.g., 15000"
						/>
					</div>
				</div>

				<div>
					<label htmlFor="notes" className="block text-sm font-medium mb-2">
						Notes
					</label>
					<textarea
						{...register("notes")}
						id="notes"
						rows={3}
						className="w-full px-3 py-2 border rounded-lg"
						placeholder="Additional details about the car..."
					/>
				</div>

				<div className="flex gap-4">
					<button
						type="submit"
						disabled={isSubmitting}
						className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
					>
						{isSubmitting ? "Adding Car..." : "Add Car"}
					</button>
					<button
						type="button"
						onClick={() => router.back()}
						className="px-6 py-2 border rounded-lg hover:bg-gray-50"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
