"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import PopoverSelect from "@/components/shared/popover-select";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
	FieldSet,
} from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import type { Car } from "@/features-v2/cars/actions/get-cars";
import {
	calculatePercentageFromAmount,
	companyProfitAndPercentageCalculator,
	parseAmountInput,
	parsePercentageInput,
	shareholderProfitAndPercentageCalculator,
} from "@/lib/utils";
import { useUpdateCarSharer } from "../mutations/use-update-car-sharer";
import { useGetShareholders } from "../queries/use-car-sharer";
import {
	UpdateCarSharerSchema,
	type UpdateCarSharerValues,
} from "../validation";

interface EditCarSharerFormProps {
	car: Car;
	onClose?: () => void;
}

export default function EditCarSharerForm({
	car,
	onClose,
}: EditCarSharerFormProps) {
	const updateCarSharerMutation = useUpdateCarSharer();

	const form = useForm<UpdateCarSharerValues>({
		resolver: zodResolver(UpdateCarSharerSchema),
		defaultValues: {
			id: car.id,
			price: car.price ?? undefined,
			shareholderPercentage: car.shareholderPercentage ?? 0,
			investmentAmount: car.investmentAmount ?? 0,
			shareholderId: car.shareholder?.id ?? undefined,
		},
	});

	const price = form.watch("price");
	const shareholderPercentage = form.watch("shareholderPercentage");

	const {
		data: shareholders,
		isLoading: isLoadingShareholders,
		isError: isErrorShareholders,
	} = useGetShareholders();

	const resetShareholderPercentage = () => {
		const shareholderId = form.getValues("shareholderId");
		if (!shareholderId) {
			form.setValue("shareholderPercentage", 0);
		}
	};

	const onSubmit = async (values: UpdateCarSharerValues) => {
		await updateCarSharerMutation.mutateAsync(values);
		onClose?.();
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
			<FieldSet>
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
									price && shareholderPercentage !== undefined
										? companyProfitAndPercentageCalculator(
												price,
												shareholderPercentage,
											).companyProfit
										: ""
								}
								onChange={(e) => {
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
									shareholderPercentage !== undefined
										? Math.round(
												companyProfitAndPercentageCalculator(
													0,
													shareholderPercentage,
												).companyPercentage,
											)
										: ""
								}
								onChange={(e) => {
									const val = parsePercentageInput(e.target.value) ?? 0;
									form.setValue("shareholderPercentage", 100 - val, {
										shouldValidate: true,
									});
								}}
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
									price && shareholderPercentage !== undefined
										? shareholderProfitAndPercentageCalculator(
												price,
												shareholderPercentage,
											).shareholderProfit
										: ""
								}
								onChange={(e) => {
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
											const val = parsePercentageInput(e.target.value);
											field.onChange(val);
										}}
										value={
											field.value !== undefined ? Math.round(field.value) : ""
										}
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
										// disabled={price === undefined}
										onChange={(e) => {
											const value = e.target.value;
											field.onChange(value === "" ? undefined : Number(value));
										}}
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
										onChange={(e) => {
											const value = e.target.value;
											field.onChange(value === "" ? undefined : Number(value));
										}}
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
				<FieldSeparator />
				{/* Shareholder */}
				<FieldGroup>
					<PopoverSelect
						control={form.control}
						name="shareholderId"
						label="Select Shareholder (Optional)"
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
			</FieldSet>

			<div className="flex justify-end gap-3 pt-4 border-t">
				<Button
					type="button"
					variant="outline"
					onClick={() => {
						form.reset();
						onClose?.();
					}}
					disabled={
						updateCarSharerMutation.isPending || form.formState.isSubmitting
					}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={
						updateCarSharerMutation.isPending || form.formState.isSubmitting
					}
				>
					{updateCarSharerMutation.isPending ? "Saving..." : "Save Changes"}
				</Button>
			</div>
		</form>
	);
}
