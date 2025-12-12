"use client";

import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface LocalFile {
	file: File;
	preview: string;
}

interface FileUploadProps {
	maxFiles?: number;
	maxSizeMB?: number;
	acceptedTypes?: string;
	disabled?: boolean;
	onChange?: (files: File[]) => void;
}

export function FileUpload({
	maxFiles = 5,
	maxSizeMB = 5,
	acceptedTypes = "image/*",
	disabled = false,
	onChange,
}: FileUploadProps) {
	const [files, setFiles] = useState<LocalFile[]>([]);
	const [error, setError] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setError("");
		const selectedFiles = Array.from(e.target.files || []);

		// Validation
		if (selectedFiles.length + files.length > maxFiles) {
			setError(`Maximum ${maxFiles} files allowed`);
			return;
		}

		const oversizedFiles = selectedFiles.filter(
			(f) => f.size > maxSizeMB * 1024 * 1024,
		);
		if (oversizedFiles.length > 0) {
			setError(`Files exceed ${maxSizeMB}MB limit`);
			return;
		}

		const invalidTypeFiles = selectedFiles.filter(
			(f) => !f.type.match(/^image\//),
		);
		if (invalidTypeFiles.length > 0) {
			setError("Only image files are allowed");
			return;
		}

		// Create previews and update state
		const newFiles = selectedFiles.map((file) => ({
			file,
			preview: URL.createObjectURL(file),
		}));

		const updatedFiles = [...files, ...newFiles];
		setFiles(updatedFiles);

		// Notify parent
		if (onChange) {
			onChange(updatedFiles.map((f) => f.file));
		}

		// Reset input
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const removeFile = (index: number) => {
		const updatedFiles = files.filter((_, i) => i !== index);

		// Clean up preview URL
		URL.revokeObjectURL(files[index].preview);

		setFiles(updatedFiles);

		if (onChange) {
			onChange(updatedFiles.map((f) => f.file));
		}
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="file-upload" className="text-sm font-medium">
					Car Photos {files.length > 0 && `(${files.length}/${maxFiles})`}
				</Label>

				<div className="space-y-3">
					<div className="flex items-center gap-3">
						<Input
							ref={fileInputRef}
							id="file-upload"
							name="photos"
							type="file"
							multiple={maxFiles > 1}
							accept={acceptedTypes}
							onChange={handleFileChange}
							disabled={disabled || files.length >= maxFiles}
							className="hidden"
						/>

						<Button
							type="button"
							variant="outline"
							onClick={() => fileInputRef.current?.click()}
							disabled={disabled || files.length >= maxFiles}
							className="gap-2"
						>
							<Upload className="h-4 w-4" />
							Select Files
						</Button>

						<span className="text-sm text-muted-foreground">
							Up to {maxFiles} files, {maxSizeMB}MB each
						</span>
					</div>

					{error && <p className="text-sm text-destructive">{error}</p>}
				</div>
			</div>

			{files.length > 0 && (
				<div className="space-y-3">
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
						{files.map((fileItem, index) => (
							<Card key={fileItem.file.name} className="overflow-hidden">
								<CardContent className="p-3">
									<div className="relative">
										<Button
											type="button"
											variant="destructive"
											size="icon"
											className="absolute -right-2 -top-2 h-6 w-6 rounded-full z-10"
											onClick={() => removeFile(index)}
											aria-label={`Remove ${fileItem.file.name}`}
										>
											<X className="h-3 w-3" />
										</Button>

										<div className="aspect-square overflow-hidden rounded-md mb-2">
											<Image
												width={200}
												height={200}
												src={fileItem.preview}
												alt={`Preview ${index + 1}`}
												className="h-full w-full object-cover"
											/>
										</div>

										<div className="space-y-1">
											<p className="text-xs font-medium truncate">
												{fileItem.file.name}
											</p>
											<p className="text-xs text-muted-foreground">
												{(fileItem.file.size / 1024 / 1024).toFixed(1)} MB
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
