"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format as formatDate } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { useGetCars } from "@/features/cars/queries/use-cars";
import { useEmployees } from "@/features/employees/queries/use-employees";
import { cn } from "@/lib/utils";
import type { Expense } from "../actions/get-expenses";
import { useUpdateExpense } from "../mutations/use-update-expense";
import { useExpenseCategories } from "../queries/get-expense-category";
import { UpdateExpenseSchema, type UpdateExpenseValues } from "../validation";

interface EditExpenseFormProps {
	onClose: () => void;
	expense: Expense;
}

export default function EditExpenseForm({
	onClose,
	expense,
}: EditExpenseFormProps) {
	const updateExpenseMutation = useUpdateExpense();

	const {
		data: employees = [],
		isLoading: isLoadingEmployees,
		isError: isErrorEmployees,
	} = useEmployees();
	const {
		data: cars = [],
		isLoading: isLoadingCars,
		isError: isErrorCars,
	} = useGetCars();
	const {
		data: expenseCategories = [],
		isLoading: isLoadingExpenseCategories,
		isError: isErrorExpenseCategories,
	} = useExpenseCategories();

	const form = useForm<UpdateExpenseValues>({
		resolver: zodResolver(UpdateExpenseSchema),
		defaultValues: {
			id: expense.id,
			date: expense.date
				? typeof expense.date === "string"
					? new Date(expense.date)
					: expense.date
				: undefined,
			paidToId: expense.paidTo?.id ?? null,
			categoryId: expense.category?.id ?? null,
			amount: expense.amount,
			carId: expense.car?.id ?? null,
			notes: expense.notes ?? "",
		},
	});

	const onSubmit = async (values: UpdateExpenseValues) => {
		await updateExpenseMutation.mutateAsync(values);
		form.reset();
		onClose();
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
			<FieldSet>
				<FieldGroup>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Date */}
						<Controller
							control={form.control}
							name="date"
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>
										Date <span className="text-red-500">*</span>
									</FieldLabel>
									<FieldGroup>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													className={cn(
														"w-full pl-3 text-left font-normal",
														!field.value && "text-muted-foreground",
													)}
												>
													{field.value ? (
														formatDate(field.value, "PPP")
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date: Date) =>
														date > new Date() || date < new Date("1900-01-01")
													}
												/>
											</PopoverContent>
										</Popover>
									</FieldGroup>
									{fieldState.error && (
										<FieldError>{fieldState.error.message}</FieldError>
									)}
								</Field>
							)}
						/>

						{/* Amount */}
						<Controller
							control={form.control}
							name="amount"
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>
										Amount <span className="text-red-500">*</span>
									</FieldLabel>
									<FieldGroup>
										<InputGroup className="flex-1">
											<InputGroupInput
												id="amount"
												type="number"
												step="1"
												min="0"
												{...field}
												onChange={(e) => {
													const value = e.target.value;
													field.onChange(
														value === "" ? undefined : Number(value),
													);
												}}
												value={field.value ?? 1}
											/>
											<InputGroupAddon>
												<span className="text-gray-500">Ks</span>
											</InputGroupAddon>
										</InputGroup>
									</FieldGroup>
									{fieldState.error && (
										<FieldError>{fieldState.error.message}</FieldError>
									)}
								</Field>
							)}
						/>
					</div>

					{/* Category */}
					<PopoverSelect
						control={form.control}
						selector={"reason"}
						name={"categoryId"}
						label={"Reason (Optional)"}
						items={expenseCategories}
						isLoading={isLoadingExpenseCategories}
						isError={isErrorExpenseCategories}
						allowNone
						matchTriggerWidth
						getLabel={(cat) => cat.name}
						getValue={(cat) => cat.id}
					/>

					{/* Employee */}
					<PopoverSelect
						control={form.control}
						selector={"employee"}
						name={"paidToId"}
						label={"Employee (Optional)"}
						items={employees}
						isLoading={isLoadingEmployees}
						isError={isErrorEmployees}
						allowNone
						matchTriggerWidth
						getLabel={(emp) => emp.name}
						getValue={(emp) => emp.id}
						getSubLabel={(emp) => emp.position}
					/>

					{/* Car */}
					<PopoverSelect
						control={form.control}
						selector={"car"}
						name={"carId"}
						label={"Car (Optional)"}
						items={cars}
						isLoading={isLoadingCars}
						isError={isErrorCars}
						allowNone
						matchTriggerWidth
						getLabel={(car) => `${car.name} (${car.color})`}
						getValue={(car) => car.id}
						getSubLabel={(car) => car.licenseNumber ?? "No Number"}
					/>

					{/* Note*/}
					<Controller
						control={form.control}
						name="notes"
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>Note (Optional)</FieldLabel>
								<FieldGroup>
									<Textarea
										placeholder="Additional notes about this expense..."
										className="max-h-[100px] resize-y"
										{...field}
									/>
								</FieldGroup>
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
						onClose();
					}}
					disabled={
						updateExpenseMutation.isPending || form.formState.isSubmitting
					}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={
						updateExpenseMutation.isPending || form.formState.isSubmitting
					}
				>
					{updateExpenseMutation.isPending ? "Saving..." : "Save Changes"}
				</Button>
			</div>
		</form>
	);
}
