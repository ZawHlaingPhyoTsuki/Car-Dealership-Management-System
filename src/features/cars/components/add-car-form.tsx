"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
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
	CreateCarSchema,
	type CreateCarValues,
} from "@/features/cars/validation";
import { normalizeNumberInput } from "@/lib/utils";
import { useCreateCar } from "../mutations/use-create-car";

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
			status: CarStatus.AVAILABLE,
			purchasedPrice: undefined,
			sellingPrice: undefined,
			companyInvestedAmount: undefined,
			shareholderInvestedAmount: undefined,
			companyProfitAmount: undefined,
			shareholderProfitAmount: undefined,
			licenseNumber: null,
			soldAt: null,
			notes: "",
			shareholderId: null,
		},
	});

	const status = form.watch("status");

	const shareholderId = form.watch("shareholderId");

	const onSubmit = async (values: CreateCarValues) => {
		await createCarMutation.mutateAsync(values);
		form.reset();
		onClose?.();
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <useEffect>
	useEffect(() => {
		if (status !== CarStatus.SOLD) {
			form.setValue("soldAt", null);
		}
	}, [status]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <useEffect>
	useEffect(() => {
		if (!shareholderId) {
			// form.setValue("companyInvestedAmount", undefined);
			form.setValue("shareholderInvestedAmount", undefined);
		}
	}, [shareholderId]);

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
			<FieldSet>
				<FieldGroup>
					<div className="space-y-6">
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
										<Input
											id="name"
											placeholder="Toyota Camry 2023"
											{...field}
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
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
											type="text"
											inputMode="numeric"
											id="purchasedPrice"
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
										<FieldLabel htmlFor="sellingPrice">
											Selling Price
										</FieldLabel>
										<Input
											type="text"
											inputMode="numeric"
											id="sellingPrice"
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
						</div>

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

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Company Invested Amount */}
							<Controller
								name="companyInvestedAmount"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="companyInvestedAmount">
											7hr Buy Amount
										</FieldLabel>
										<Input
											type="text"
											inputMode="numeric"
											id="companyInvestedAmount"
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
											type="text"
											inputMode="numeric"
											id="shareholderInvestedAmount"
											{...field}
											value={
												field.value === undefined || field.value === null
													? ""
													: field.value.toString()
											}
											onChange={(e) => {
												field.onChange(normalizeNumberInput(e.target.value));
											}}
											disabled={!shareholderId}
										/>
										{fieldState.error && (
											<FieldError>{fieldState.error.message}</FieldError>
										)}
									</Field>
								)}
							/>
						</div>

						<div
							className={`grid grid-cols-1 ${
								status === CarStatus.SOLD && "md:grid-cols-2"
							} gap-4`}
						>
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
