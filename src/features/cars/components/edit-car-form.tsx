"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { CarStatus } from "@/app/generated/prisma/enums";
import PopoverSelect from "@/components/shared/popover-select";
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
import { useGetShareholders } from "@/features/car-sharers/queries/use-car-sharer";
import {
	UpdateCarSchema,
	type UpdateCarValues,
} from "@/features/cars/validation";
import { normalizeNumberInput } from "@/lib/utils";
import type { Car } from "../actions/get-cars";
import { useUpdateCar } from "../mutations/use-update-car";

interface EditCarFormProps {
	car: Car;
	onClose?: () => void;
}

export default function EditCarForm({ car, onClose }: EditCarFormProps) {
	const updateCarMutation = useUpdateCar();
	const {
		data: shareholders,
		isLoading: isLoadingShareholders,
		isError: isErrorShareholders,
	} = useGetShareholders();

	const form = useForm<UpdateCarValues>({
		resolver: zodResolver(UpdateCarSchema),
		defaultValues: {
			id: car.id,
			name: car.name,
			status: car.status,
			purchasedPrice: car.purchasedPrice,
			sellingPrice: car.sellingPrice,
			companyInvestedAmount: car.companyInvestedAmount,
			shareholderInvestedAmount: car.shareholderInvestedAmount,
			companyProfitAmount: car.companyProfitAmount,
			shareholderProfitAmount: car.shareholderProfitAmount,
			licenseNumber: car.licenseNumber,
			soldAt: car.soldAt,
			notes: car.notes,
			shareholderId: car.shareholderId,
		},
	});

	const status = form.watch("status");

	const onSubmit = async (values: UpdateCarValues) => {
		await updateCarMutation.mutateAsync(values);
		form.reset();
		onClose?.();
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
			<FieldSet>
				<FieldGroup>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Name */}
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
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

						{/* Status */}
						<Controller
							name="status"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="status">Status</FieldLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger
											id="status"
											aria-invalid={fieldState.invalid}
										>
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

						{/* Purchased Price */}
						<Controller
							name="purchasedPrice"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="purchasedPrice">
										Purchased Price
									</FieldLabel>
									<Input
										id="purchasedPrice"
										type="text"
										inputMode="numeric"
										{...field}
										value={
											field.value === undefined || field.value === null
												? ""
												: field.value.toString()
										}
										onChange={(e) => {
											field.onChange(normalizeNumberInput(e.target.value));
										}}
									/>
									{fieldState.error && (
										<FieldError>{fieldState.error.message}</FieldError>
									)}
								</Field>
							)}
						/>

						{/* Selling Price */}
						<Controller
							name="sellingPrice"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="sellingPrice">Selling Price</FieldLabel>
									<Input
										id="sellingPrice"
										type="text"
										inputMode="numeric"
										{...field}
										value={
											field.value === undefined || field.value === null
												? ""
												: field.value.toString()
										}
										onChange={(e) => {
											field.onChange(normalizeNumberInput(e.target.value));
										}}
									/>
									{fieldState.error && (
										<FieldError>{fieldState.error.message}</FieldError>
									)}
								</Field>
							)}
						/>

						{/* Company Invested Amount */}
						<Controller
							name="companyInvestedAmount"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="companyInvestedAmount">
										Company Invested Amount
									</FieldLabel>
									<Input
										id="companyInvestedAmount"
										type="text"
										inputMode="numeric"
										{...field}
										value={
											field.value === undefined || field.value === null
												? ""
												: field.value.toString()
										}
										onChange={(e) => {
											field.onChange(normalizeNumberInput(e.target.value));
										}}
									/>
									{fieldState.error && (
										<FieldError>{fieldState.error.message}</FieldError>
									)}
								</Field>
							)}
						/>

						{/* Shareholder Invested Amount */}
						<Controller
							name="shareholderInvestedAmount"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="shareholderInvestedAmount">
										Sharer Buy Amount
									</FieldLabel>
									<Input
										id="shareholderInvestedAmount"
										type="text"
										inputMode="numeric"
										{...field}
										value={
											field.value === undefined || field.value === null
												? ""
												: field.value.toString()
										}
										onChange={(e) => {
											field.onChange(normalizeNumberInput(e.target.value));
										}}
									/>
									{fieldState.error && (
										<FieldError>{fieldState.error.message}</FieldError>
									)}
								</Field>
							)}
						/>

						{/* Company Profit Amount */}
						<Controller
							name="companyProfitAmount"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="companyProfitAmount">
										Company Profit Amount
									</FieldLabel>
									<Input
										id="companyProfitAmount"
										type="text"
										inputMode="numeric"
										{...field}
										value={
											field.value === undefined || field.value === null
												? ""
												: field.value.toString()
										}
										onChange={(e) => {
											field.onChange(normalizeNumberInput(e.target.value));
										}}
									/>
									{fieldState.error && (
										<FieldError>{fieldState.error.message}</FieldError>
									)}
								</Field>
							)}
						/>

						{/* Shareholder Profit Amount */}
						<Controller
							name="shareholderProfitAmount"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="shareholderProfitAmount">
										Shareholder Profit Amount
									</FieldLabel>
									<Input
										id="shareholderProfitAmount"
										type="text"
										inputMode="numeric"
										{...field}
										value={
											field.value === undefined || field.value === null
												? ""
												: field.value.toString()
										}
										onChange={(e) => {
											field.onChange(normalizeNumberInput(e.target.value));
										}}
									/>
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
									<FieldLabel htmlFor="licenseNumber">
										License Number
									</FieldLabel>
									<Input
										id="licenseNumber"
										{...field}
										value={field.value ?? ""}
										onChange={(e) => {
											const value = e.target.value;
											field.onChange(value === "" ? null : value);
										}}
									/>
									{fieldState.error && (
										<FieldError>{fieldState.error.message}</FieldError>
									)}
								</Field>
							)}
						/>

						{/* Shareholder Select */}
						<PopoverSelect
							control={form.control}
							name="shareholderId"
							label="Select Shareholder"
							selector="shareholder"
							matchTriggerWidth
							allowNone
							items={shareholders ?? []}
							isError={isErrorShareholders}
							isLoading={isLoadingShareholders}
							getValue={(sh) => sh.id}
							getLabel={(sh) => sh.name}
							getSubLabel={(sh) => sh.phone ?? "No phone"}
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
					</div>

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
									value={field.value ?? ""}
									onChange={(e) => {
										const value = e.target.value;
										field.onChange(value === "" ? null : value);
									}}
								/>
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</Field>
						)}
					/>
				</FieldGroup>
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
					{updateCarMutation.isPending ? "Saving..." : "Save Car"}
				</Button>
			</div>
		</form>
	);
}
