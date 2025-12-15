"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CarStatus } from "@/app/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCar } from "../mutations/use-create-car";
import { CreateCarSchema, type CreateCarValues } from "../validation";

interface AddCarFormProps {
	onClose?: () => void;
}

export default function AddCarForm({ onClose }: AddCarFormProps) {
	const createCarMutation = useCreateCar();

	const form = useForm<CreateCarValues>({
		resolver: zodResolver(CreateCarSchema),
		defaultValues: {
			name: undefined,
			price: 0,
			color: undefined,
			licenseNumber: undefined,
			notes: undefined,
			status: CarStatus.AVAILABLE,
		},
	});

	const onSubmit = async (values: CreateCarValues) => {
		await createCarMutation.mutateAsync(values);
		form.reset();
		onClose?.();
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
			<FieldSet>
				<FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Name */}
					<Controller
						name="name"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field
								data-invalid={fieldState.invalid}
								className="md:col-span-2"
							>
								<FieldLabel htmlFor="name">
									Car Name <span className="text-red-500">*</span>
								</FieldLabel>
								<Input id="name" placeholder="Toyota Camry 2023" {...field} />
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</Field>
						)}
					/>

					{/* Price */}
					<Controller
						name="price"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="price">
									Selling Price <span className="text-red-500">*</span>
								</FieldLabel>
								<InputGroup>
									<InputGroupInput
										id="price"
										type="number"
										min="0"
										step="1"
										placeholder="25000"
										{...field}
										onChange={(e) =>
											field.onChange(
												e.target.value ? parseFloat(e.target.value) : 0,
											)
										}
										value={field.value || ""}
									/>
									<InputGroupAddon>$</InputGroupAddon>
								</InputGroup>
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</Field>
						)}
					/>

					{/* Color */}
					<Controller
						name="color"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="color">Color</FieldLabel>
								<Input id="color" placeholder="Silver" {...field} />
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</Field>
						)}
					/>

					{/* License Number */}
					<Controller
						name="licenseNumber"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="licenseNumber">License Number</FieldLabel>
								<Input
									id="licenseNumber"
									placeholder="License Number"
									{...field}
								/>
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</Field>
						)}
					/>

					{/* Status */}
					<Controller
						name="status"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="status">Status</FieldLabel>
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger id="status" aria-invalid={fieldState.invalid}>
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										{Object.values(CarStatus).map((status) => (
											<SelectItem key={status} value={status}>
												{status.replace(/_/g, " ")}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</Field>
						)}
					/>
				</FieldGroup>

				{/* Notes */}
				<Controller
					name="notes"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="notes">Notes</FieldLabel>
							<Textarea
								id="notes"
								placeholder="Additional details about the car..."
								rows={3}
								{...field}
							/>
							{fieldState.error && (
								<FieldError>{fieldState.error.message}</FieldError>
							)}
						</Field>
					)}
				/>

				<FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4"></FieldGroup>
			</FieldSet>

			{/* Form Actions */}
			<div className="flex justify-end gap-3 pt-4 border-t">
				<Button
					type="button"
					variant="outline"
					onClick={() => {
						onClose?.();
						form.reset();
					}}
					disabled={createCarMutation.isPending || form.formState.isSubmitting}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={createCarMutation.isPending || form.formState.isSubmitting}
				>
					{createCarMutation.isPending ? "Saving..." : "Save Car"}
				</Button>
			</div>
		</form>
	);
}
