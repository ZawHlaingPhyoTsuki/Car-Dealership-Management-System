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
	FieldSeparator,
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
import { useGetShareholders } from "@/features/car-sharers/queries/use-car-sharer";
import {
	calculatePercentageFromAmount,
	companyProfitAndPercentageCalculator,
	parseAmountInput,
	parsePercentageInput,
	shareholderProfitAndPercentageCalculator,
} from "@/lib/utils";
import { useCreateCar } from "../mutations/use-create-car";
import { CreateCarSchema, type CreateCarValues } from "../validation";

interface AddCarFormProps {
	onClose?: () => void;
}

export default function AddCarForm({ onClose }: AddCarFormProps) {
	const createCarMutation = useCreateCar();
	const {
		data: shareholders,
		isLoading: isLoadingShareholders,
		isError: isErrorShareholders,
	} = useGetShareholders();

	const form = useForm<CreateCarValues>({
		resolver: zodResolver(CreateCarSchema),
		defaultValues: {
			name: "",
			price: 0,
			licenseNumber: "",
			notes: "",
			status: CarStatus.AVAILABLE,
			soldAt: null,

			// Shareholder
			shareholderPercentage: 0,
			investmentAmount: 0,
			shareholderId: null,
		},
	});

	const status = form.watch("status");
	const price = form.watch("price");
	const shareholderPercentage = form.watch("shareholderPercentage");
	const shareholderId = form.watch("shareholderId");

	const onSubmit = async (values: CreateCarValues) => {
		await createCarMutation.mutateAsync(values);
		form.reset();
		onClose?.();
	};

	const resetShareholderPercentage = () => {
		const shareholderId = form.getValues("shareholderId");
		if (!shareholderId) {
			form.setValue("shareholderPercentage", 0);
		}
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
							/>
							{fieldState.error && (
								<FieldError>{fieldState.error.message}</FieldError>
							)}
						</Field>
					)}
				/>

				<FieldSeparator />

				{/* Shareholder */}
				<FieldGroup>
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
						onClear={resetShareholderPercentage}
					/>
				</FieldGroup>

				<FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* 7hrs Profit Amount */}
					<Field>
						<FieldLabel htmlFor="companyProfitAmount">
							7hrs Profit Amount
						</FieldLabel>
						<InputGroup>
							<InputGroupInput
								id="companyProfitAmount"
								type="number"
								min="0"
								max={price?.toString() ?? ""}
								step="1"
								value={
									shareholderId && price && shareholderPercentage !== undefined
										? companyProfitAndPercentageCalculator(
												price,
												shareholderPercentage,
											).companyProfit
										: ""
								}
								onChange={(e) => {
									if (!shareholderId) return;
									const val = parseAmountInput(e.target.value);
									if (!price) return;
									// Clamp value to price
									const clampedVal = Math.min(Math.max(val, 0), price);
									const newPercentage = calculatePercentageFromAmount(
										price - clampedVal,
										price,
									);
									form.setValue("shareholderPercentage", newPercentage, {
										shouldValidate: true,
									});
								}}
								disabled={!shareholderId}
							/>
							<InputGroupAddon>Ks</InputGroupAddon>
						</InputGroup>
					</Field>

					{/* 7hrs Profit Percentage */}
					<Field>
						<FieldLabel htmlFor="companyProfitPercentage">
							7hrs Profit Percentage (%)
						</FieldLabel>
						<InputGroup>
							<InputGroupInput
								id="companyProfitPercentage"
								type="number"
								min="0"
								max="100"
								step="1"
								value={
									shareholderId && shareholderPercentage !== undefined
										? Math.round(
												companyProfitAndPercentageCalculator(
													0,
													shareholderPercentage,
												).companyPercentage,
											)
										: ""
								}
								onChange={(e) => {
									if (!shareholderId) return;
									const val = parsePercentageInput(e.target.value);
									form.setValue("shareholderPercentage", 100 - val, {
										shouldValidate: true,
									});
								}}
								disabled={!shareholderId}
							/>
							<InputGroupAddon>%</InputGroupAddon>
						</InputGroup>
					</Field>

					{/* Sharer Profit Amount */}
					<Field>
						<FieldLabel htmlFor="sharerProfitAmount">
							Sharer Profit Amount
						</FieldLabel>
						<InputGroup>
							<InputGroupInput
								id="sharerProfitAmount"
								type="number"
								min="0"
								max={price?.toString() ?? ""}
								step="1"
								value={
									shareholderId && price && shareholderPercentage !== undefined
										? shareholderProfitAndPercentageCalculator(
												price,
												shareholderPercentage,
											).shareholderProfit
										: ""
								}
								onChange={(e) => {
									if (!shareholderId) return;
									const val = parseAmountInput(e.target.value);
									if (!price) return;
									// Clamp value to price
									const clampedVal = Math.min(Math.max(val, 0), price);
									const newPercentage = calculatePercentageFromAmount(
										clampedVal,
										price,
									);
									form.setValue("shareholderPercentage", newPercentage, {
										shouldValidate: true,
									});
								}}
								disabled={!shareholderId}
							/>
							<InputGroupAddon>Ks</InputGroupAddon>
						</InputGroup>
					</Field>

					{/* Sharer Profit Percentage */}
					<Controller
						name="shareholderPercentage"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="shareholderPercentage">
									Sharer Profit Percentage (%)
								</FieldLabel>
								<InputGroup>
									<InputGroupInput
										id="shareholderPercentage"
										type="number"
										min="0"
										max="100"
										step="1"
										{...field}
										onChange={(e) => {
											if (!shareholderId) return;
											const val = parsePercentageInput(e.target.value);
											field.onChange(val);
										}}
										value={
											shareholderId && field.value !== undefined
												? Math.round(field.value)
												: ""
										}
										disabled={!shareholderId}
									/>
									<InputGroupAddon>%</InputGroupAddon>
								</InputGroup>
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</Field>
						)}
					/>

					{/* Investment Amount */}
					<Controller
						name="investmentAmount"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="investmentAmount">
									Sharer Investment Amount
								</FieldLabel>
								<InputGroup>
									<InputGroupInput
										id="investmentAmount"
										type="number"
										step="1"
										min="0"
										{...field}
										{...(price !== undefined && { max: price.toString() })}
										onChange={(e) => {
											if (!shareholderId) return;
											field.onChange(
												parseAmountInput(
													e.target.value,
													price !== undefined ? price : undefined,
												),
											);
										}}
										value={shareholderId ? (field.value ?? "") : ""}
										disabled={!shareholderId}
									/>
									<InputGroupAddon>Ks</InputGroupAddon>
								</InputGroup>
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
								<FieldLabel htmlFor="price">Price</FieldLabel>
								<InputGroup>
									<InputGroupInput
										id="price"
										type="number"
										min="0"
										step="1"
										{...field}
										onChange={(e) =>
											field.onChange(parseAmountInput(e.target.value))
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
