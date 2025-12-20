"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { CarStatus } from "@/app/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Car } from "../actions/get-cars";
import { useUpdateCar } from "../mutations/use-update-car";
import { UpdateCarSchema, type UpdateCarValues } from "../validation";

interface EditCarFormProps {
	car: Car;
	onClose?: () => void;
}

export default function EditCarForm({ car, onClose }: EditCarFormProps) {
	const updateCarMutation = useUpdateCar();

	const form = useForm<UpdateCarValues>({
		resolver: zodResolver(UpdateCarSchema),
		defaultValues: {
			id: car.id,
			name: car.name,
			price: car.price,
			licenseNumber: car.licenseNumber ?? "",
			notes: car.notes ?? "",
			status: car.status as CarStatus,
			soldAt: car.soldAt ?? null,
		},
	});

	const status = form.watch("status");

	const onSubmit = async (values: UpdateCarValues) => {
		await updateCarMutation.mutateAsync(values);
		onClose?.();
	};

	useEffect(() => {
		if (status !== CarStatus.SOLD) {
			form.setValue("soldAt", null);
		}
	}, [status, form]);

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
										value={field.value ?? ""}
									/>
									<InputGroupAddon>Ks</InputGroupAddon>
								</InputGroup>
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
									<SelectTrigger id="status">
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

					{/* Sold Date – only show if SOLD */}
					{status === CarStatus.SOLD && (
						<Controller
							name="soldAt"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>
										Sold Date <span className="text-red-500">*</span>
									</FieldLabel>

									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className="justify-start text-left font-normal w-full"
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{field.value
													? format(field.value, "PPP")
													: "Pick a date"}
											</Button>
										</PopoverTrigger>

										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value ?? undefined}
												onSelect={(date) => field.onChange(date ?? null)}
												disabled={(date) => date > new Date()}
												autoFocus
											/>
										</PopoverContent>
									</Popover>

									{fieldState.error && (
										<FieldError>{fieldState.error.message}</FieldError>
									)}
								</Field>
							)}
						/>
					)}
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
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.error && (
								<FieldError>{fieldState.error.message}</FieldError>
							)}
						</Field>
					)}
				/>
			</FieldSet>

			{/* Form Actions */}
			<div className="flex justify-end gap-3 pt-4 border-t">
				<Button
					type="button"
					variant="outline"
					onClick={() => {
						form.reset();
						onClose?.();
					}}
					disabled={updateCarMutation.isPending || form.formState.isSubmitting}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={updateCarMutation.isPending || form.formState.isSubmitting}
				>
					{updateCarMutation.isPending ? "Saving..." : "Save Changes"}
				</Button>
			</div>
		</form>
	);
}
