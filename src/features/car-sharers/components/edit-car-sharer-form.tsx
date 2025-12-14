"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { Car } from "@/features/cars/actions/get-cars";
import {
	calculatePercentageFromAmount,
	cn,
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
			price: car.price,
			shareholderPercentage: car.shareholderPercentage ?? undefined,
			investmentAmount: car.investmentAmount ?? undefined,
			shareholderId: car.shareholder?.id ?? undefined,
		},
	});

	const price = form.watch("price");
	const shareholderPercentage = form.watch("shareholderPercentage");
	const shareholderId = form.watch("shareholderId");

	const [open, setOpen] = useState(false);
	const { data: shareholders, isLoading, isError, error } = useGetShareholders();

	const selectedShareholder = shareholders?.find(
		(sh) => sh.id === shareholderId,
	);

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
									const val = parsePercentageInput(e.target.value);
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
										min="0"
										{...(price !== undefined && { max: price.toString() })}
										step="1"
										{...field}
										onChange={(e) => {
											const max = price ?? 0;
											field.onChange(parseAmountInput(e.target.value, max));
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
				<FieldSeparator />
				<FieldGroup>
					{/* Shareholder Selection */}
					<Controller
						name="shareholderId"
						control={form.control}
						render={({ field }) => (
							<Field className="flex flex-col gap-2">
								<FieldLabel htmlFor="shareholderId">Shareholder</FieldLabel>
								<Popover open={open} onOpenChange={setOpen}>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											role="combobox"
											aria-expanded={open}
											className="justify-between font-normal"
										>
											{selectedShareholder
												? selectedShareholder.name
												: "Select shareholder..."}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-[300px] p-0" align="start">
										<Command>
											<CommandInput placeholder="Search shareholder..." />
											<CommandList>
												<CommandEmpty>
													{isLoading
														? "Loading..."
														: isError
															? "Failed to load shareholders"
															: "No shareholder found."}
												</CommandEmpty>
												<CommandGroup>
													<CommandItem
														value=""
														onSelect={() => {
															field.onChange(undefined);
															setOpen(false);
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																!field.value ? "opacity-100" : "opacity-0",
															)}
														/>
														<div className="flex flex-col">
															<span>No shareholder</span>
															<span className="text-xs text-muted-foreground">
																Remove shareholder
															</span>
														</div>
													</CommandItem>
													{shareholders?.map((shareholder) => (
														<CommandItem
															key={shareholder.id}
															value={shareholder.id}
															onSelect={() => {
																field.onChange(shareholder.id);
																setOpen(false);
															}}
														>
															<Check
																className={cn(
																	"mr-2 h-4 w-4",
																	field.value === shareholder.id
																		? "opacity-100"
																		: "opacity-0",
																)}
															/>
															<div className="flex flex-col">
																<span>{shareholder.name}</span>
																{shareholder.email && (
																	<span className="text-xs text-muted-foreground">
																		{shareholder.email}
																	</span>
																)}
															</div>
														</CommandItem>
													))}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
							</Field>
						)}
					/>
				</FieldGroup>
			</FieldSet>

			<div className="flex justify-end gap-3 pt-4 border-t">
				<Button
					type="button"
					variant="outline"
					onClick={() => onClose?.()}
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
