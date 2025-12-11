"use client";

import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import { toast } from "sonner";

interface ImageUploaderProps {
	onUploadSuccess: (publicId: string, secureUrl: string) => void;
	maxFiles?: number;
	folder?: string;
}

export default function ImageUploader({
	onUploadSuccess,
	maxFiles = 1,
	folder = "cars",
}: ImageUploaderProps) {
	const [publicIds, setPublicIds] = useState<string[]>([]);

	return (
		<div className="space-y-4">
			<CldUploadWidget
				uploadPreset="car_dealership_unsigned" // Your preset name
				options={{
					sources: ["local"],
					multiple: maxFiles > 1,
					maxFiles,
					folder,
					resourceType: "image",
					clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
					maxFileSize: 5000000, // 5MB
				}}
				onSuccess={(result) => {
					if (result.info && typeof result.info !== "string") {
						const publicId = result.info.public_id;
						const secureUrl = result.info.secure_url;

						setPublicIds((prev) => [...prev, publicId]);
						onUploadSuccess(publicId, secureUrl);

						toast.success("Image uploaded successfully!");
					}
				}}
				onError={(error) => {
					console.error("Upload error:", error);
					toast.error("Failed to upload image");
				}}
			>
				{({ open }) => (
					<button
						type="button"
						onClick={() => open()}
						className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
					>
						<div className="text-center">
							<div className="mx-auto h-12 w-12 text-gray-400">
								<svg
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<p className="mt-2 text-sm text-gray-600">
								Click to upload car photos
							</p>
							<p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
						</div>
					</button>
				)}
			</CldUploadWidget>

			{/* Image Preview */}
			{publicIds.length > 0 && (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
					{publicIds.map((publicId) => (
						<div key={publicId} className="relative">
							<CldImage
								src={publicId}
								width="200"
								height="150"
								alt="Car image"
								crop="fill"
								className="rounded-lg"
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
