"use client";

import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteCarImage } from "../mutations/use-delete-car-image";
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

	const uploadMutation = useUploadCarImage();
	const deleteMutation = useDeleteCarImage();

	// Clean up object URLs on unmount and when preview changes
	useEffect(() => {
		// This function will be called when the component unmounts or when preview changes
		return () => {
			if (preview) {
				URL.revokeObjectURL(preview);
			}
		};
	}, [preview]); // Only re-run when preview changes

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.files?.[0];
		if (!selected) return;

		if (!selected.type.startsWith("image/")) {
			toast.error("Please select an image file");
			return;
		}

		// Revoke previous object URL before creating a new one
		if (preview) {
			URL.revokeObjectURL(preview);
		}

		setFile(selected);
		setPreview(URL.createObjectURL(selected));
	};

	const handleUpload = async () => {
		if (!file) return;

		try {
			await uploadMutation.mutateAsync({
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

	const handleDeleteCurrentImage = async () => {
		try {
			await deleteMutation.mutateAsync({
				carId,
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

	const handleRemovePreview = () => {
		if (preview) {
			URL.revokeObjectURL(preview);
		}
		setPreview(null);
		setFile(null);
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
							<div className="relative w-full h-64 rounded-lg border overflow-hidden">
								<Image
									fill
									src={preview}
									alt="Preview"
									className="object-cover"
								/>
							</div>
							<button
								type="button"
								aria-label="Remove preview image"
								onClick={handleRemovePreview}
								className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
					) : currentImageUrl ? (
						<div className="space-y-3">
							<p className="text-sm text-muted-foreground">Current image:</p>
							<div className="relative w-full h-64 rounded-lg border overflow-hidden">
								<Image
									fill
									src={currentImageUrl}
									alt="Current car"
									className="object-cover"
								/>
							</div>
						</div>
					) : (
						<div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
							<Upload className="mx-auto h-12 w-12 text-gray-400" />
							<p className="mt-2 text-sm text-gray-600">No image selected</p>
						</div>
					)}

					<div className="space-y-2">
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
							disabled={deleteMutation.isPending || uploadMutation.isPending}
						>
							{preview ? "Change Image" : "Select Image"}
						</Button>
						{currentImageUrl && (
							<Button
								variant="destructive"
								onClick={handleDeleteCurrentImage}
								className="w-full"
								disabled={deleteMutation.isPending || uploadMutation.isPending}
							>
								{deleteMutation.isPending
									? "Deleting..."
									: "Remove Current Image"}
							</Button>
						)}
					</div>
				</div>

				<div className="flex justify-end gap-3">
					<Button
						variant="outline"
						onClick={handleClose}
						disabled={deleteMutation.isPending || uploadMutation.isPending}
					>
						Cancel
					</Button>
					<Button
						onClick={handleUpload}
						disabled={!file || uploadMutation.isPending}
					>
						{uploadMutation.isPending ? "Uploading..." : "Save Image"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
