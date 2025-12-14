"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
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
import type { Car } from "@/features/cars/actions/get-cars";
import {
	calculatePercentageFromAmount,
	cn,
	companyProfitAndPercentageCalculator,
	parseAmountInput,
	parsePercentageInput,
	shareholderProfitAndPercentageCalculator,
} from "@/lib/utils";
import { getShareholders } from "../actions/get-shareholders";
import { useUpdateCarSharer } from "../mutations/use-update-car-sharer";
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
			shareholderName: car.shareholder?.name ?? undefined,
			shareholderEmail: car.shareholder?.email ?? undefined,
			shareholderPhone: car.shareholder?.phone ?? undefined,
			shareholderId: car.shareholder?.id ?? undefined,
		} as UpdateCarSharerValues,
	});

	const price = form.watch("price");
	const shareholderPercentage = form.watch("shareholderPercentage");

	const [open, setOpen] = useState(false);
	const { data: shareholders, isLoading } = useQuery({
		queryKey: ["shareholders"],
		queryFn: getShareholders,
	});

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
									if (val === undefined) {
										form.setValue(
											"shareholderPercentage",
											undefined as unknown as number,
											{ shouldValidate: true },
										);
										return;
									}
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
										? companyProfitAndPercentageCalculator(
												0,
												shareholderPercentage,
											).companyPercentage
										: ""
								}
								onChange={(e) => {
									const val = parsePercentageInput(e.target.value);
									if (val === undefined) {
										form.setValue(
											"shareholderPercentage",
											undefined as unknown as number,
											{ shouldValidate: true },
										);
										return;
									}
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
									if (val === undefined) {
										form.setValue(
											"shareholderPercentage",
											undefined as unknown as number,
											{ shouldValidate: true },
										);
										return;
									}
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
											field.value !== undefined ? Math.round(field.value) : 0
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
				<FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Sharerholder Name */}
					<Controller
						name="shareholderName"
						control={form.control}
						render={({ field }) => {
							return (
								<Field className="flex flex-col gap-2">
									<FieldLabel htmlFor="shareholderName">
										Shareholder Name
									</FieldLabel>
									<Popover open={open} onOpenChange={setOpen}>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												role="combobox"
												aria-expanded={open}
												className="justify-between font-normal"
											>
												{field.value || "Select or type name..."}
												<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
											</Button>
										</PopoverTrigger>
										<PopoverContent
											className="w-[300px] p-0"
											align="start"
											asChild
										>
											<Command>
												<CommandInput
													placeholder="Search shareholder..."
													onValueChange={(search) => {
														// Always update the name field
														field.onChange(search);

														// Only clear the ID if the search doesn't match any existing shareholder
														const existingShareholder = shareholders?.find(
															(s) =>
																s.name.toLowerCase() === search.toLowerCase(),
														);

														if (existingShareholder) {
															// Keep the ID if name matches an existing shareholder
															form.setValue(
																"shareholderId",
																existingShareholder.id,
															);
															form.setValue(
																"shareholderEmail",
																existingShareholder.email ?? "",
															);
															form.setValue(
																"shareholderPhone",
																existingShareholder.phone ?? "",
															);
														} else {
															// Clear the ID only if it's a truly new name
															form.setValue("shareholderId", null);
														}
													}}
												/>
												<CommandList>
													<CommandEmpty>
														{isLoading ? "Loading..." : "No shareholder found."}
													</CommandEmpty>
													<CommandGroup>
														{shareholders?.map((shareholder) => (
															<CommandItem
																key={shareholder.id}
																value={shareholder.name}
																onSelect={() => {
																	// Set all fields from selected shareholder
																	field.onChange(shareholder.name);
																	form.setValue(
																		"shareholderId",
																		shareholder.id,
																	);
																	form.setValue(
																		"shareholderEmail",
																		shareholder.email ?? "",
																	);
																	form.setValue(
																		"shareholderPhone",
																		shareholder.phone ?? "",
																	);
																	setOpen(false);
																}}
															>
																<Check
																	className={cn(
																		"mr-2 h-4 w-4",
																		field.value === shareholder.name
																			? "opacity-100"
																			: "opacity-0",
																	)}
																/>
																<div className="flex flex-col">
																	<span>{shareholder.name}</span>
																	{shareholder.phone && (
																		<span className="text-xs text-muted-foreground">
																			{shareholder.phone}
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
									<div className="text-[0.8rem] text-muted-foreground">
										Type a new name to create, or select from list.
									</div>
								</Field>
							);
						}}
					/>

					{/* Sharerholder Email */}
					<Controller
						name="shareholderEmail"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="shareholderEmail">
									Shareholder Email
								</FieldLabel>
								<Input
									id="shareholderEmail"
									placeholder="john.doe@example.com"
									{...field}
									value={field.value ?? ""}
								/>
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</Field>
						)}
					/>

					{/* Sharerholder Phone */}
					<Controller
						name="shareholderPhone"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="shareholderPhone">
									Shareholder Phone
								</FieldLabel>
								<Input
									id="shareholderPhone"
									placeholder="123-456-7890"
									{...field}
									value={field.value ?? ""}
								/>
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
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
