"use client";

import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useUploadCarImage } from "../mutations/use-upload-car-image";

interface UploadCarImageDialogProps {
	carId: string;
	currentImageUrl?: string | null;
	imagePublicId?: string | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
}

export default function UploadCarImageDialog({
	carId,
	currentImageUrl,
	imagePublicId,
	open,
	onOpenChange,
	onSuccess,
}: UploadCarImageDialogProps) {
	const [preview, setPreview] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const mutation = useUploadCarImage();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.files?.[0];
		if (!selected) return;

		if (!selected.type.startsWith("image/")) {
			toast.error("Please select an image file");
			return;
		}

		setFile(selected);
		setPreview(URL.createObjectURL(selected));
	};

	const handleUpload = async () => {
		if (!file) return;

		try {
			await mutation.mutateAsync({
				carId,
				file,
				oldPublicId: imagePublicId,
			});

			onSuccess?.();
			handleClose();
		} catch {
			// Error handled by mutation
		}
	};

	const handleClose = () => {
		if (preview) {
			URL.revokeObjectURL(preview); // Clean up object URL
		}
		setPreview(null);
		setFile(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{currentImageUrl ? "Change Car Image" : "Add Car Image"}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{preview ? (
						<div className="relative">
							<Image
								width={500}
								height={500}
								src={preview}
								alt="Preview"
								className="w-full h-64 object-cover rounded-lg border"
							/>
							<button
								type="button"
								onClick={() => {
									URL.revokeObjectURL(preview);
									setPreview(null);
									setFile(null);
								}}
								className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
					) : currentImageUrl ? (
						<div className="space-y-3">
							<p className="text-sm text-muted-foreground">Current image:</p>
							<Image
								width={500}
								height={500}
								src={currentImageUrl}
								alt="Current car"
								className="w-full h-64 object-cover rounded-lg border"
							/>
						</div>
					) : (
						<div
							className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center"
							// onClick={() => fileInputRef.current?.click()}
						>
							<Upload className="mx-auto h-12 w-12 text-gray-400" />
							<p className="mt-2 text-sm text-gray-600">No image selected</p>
						</div>
					)}

					<div>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="hidden"
						/>
						<Button
							variant="outline"
							onClick={() => fileInputRef.current?.click()}
							className="w-full"
						>
							{preview ? "Change Image" : "Select Image"}
						</Button>
					</div>
				</div>

				<div className="flex justify-end gap-3">
					<Button variant="outline" onClick={handleClose}>
						Cancel
					</Button>
					<Button onClick={handleUpload} disabled={!file || mutation.isPending}>
						{mutation.isPending ? "Uploading..." : "Save Image"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
