"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format as formatDate } from "date-fns";
import { CalendarIcon, ChevronsUpDown, Loader2 } from "lucide-react";
import { type RefObject, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ExpenseCategory } from "@/app/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGetCars } from "@/features/cars/queries/use-cars";
import { useEmployees } from "@/features/employees/queries/use-employees";
import { cn } from "@/lib/utils";
import type { Expense } from "../actions/get-expenses";
import { useUpdateExpense } from "../mutations/use-update-expense";
import { UpdateExpenseSchema, type UpdateExpenseValues } from "../validation";

const expenseCategories = [
	{ value: ExpenseCategory.REPAIRS, label: "Repair" },
	{ value: ExpenseCategory.TRANSPORT, label: "Transport" },
	{ value: ExpenseCategory.AUCTION_FEES, label: "Auction Fee" },
	{ value: ExpenseCategory.CLEANING_DETAILING, label: "Cleaning Detailing" },
	{ value: ExpenseCategory.UTILITIES, label: "Utilities" },
	{ value: ExpenseCategory.RENT, label: "Rent" },
	{ value: ExpenseCategory.SALARIES, label: "Salaries" },
	{ value: ExpenseCategory.MARKETING, label: "Marketing" },
	{ value: ExpenseCategory.OFFICE_SUPPLIES, label: "Office Supplies" },
	{ value: ExpenseCategory.OTHER, label: "Other" },
];

interface EditExpenseFormProps {
	onClose: () => void;
	expense: Expense;
}

export default function EditExpenseForm({
	onClose,
	expense,
}: EditExpenseFormProps) {
	const {
		data: employees = [],
		isLoading: isLoadingEmployees,
		error: errorEmployees,
	} = useEmployees();

	const updateExpenseMutation = useUpdateExpense();
	const {
		data: cars = [],
		isLoading: isLoadingCars,
		error: errorCars,
	} = useGetCars();

	const employeeBtnRef: RefObject<HTMLButtonElement | null> = useRef(null);
	const carBtnRef: RefObject<HTMLButtonElement | null> = useRef(null);
	const [employeeBtnWidth, setEmployeeBtnWidth] = useState(0);
	const [carBtnWidth, setCarBtnWidth] = useState(0);

	const [isEmployeeOpen, setEmployeeOpen] = useState(false);
	const [isCarOpen, setCarOpen] = useState(false);

	const form = useForm<UpdateExpenseValues>({
		resolver: zodResolver(UpdateExpenseSchema),
		defaultValues: {
			id: expense.id,
			date:
				expense.date
					? typeof expense.date === "string"
						? new Date(expense.date)
						: expense.date
					: undefined,
			paidToId: expense.paidTo?.id ?? null,
			category:
				(expenseCategories.find((cat) => cat.value === expense.category)
					?.value as UpdateExpenseValues["category"]) ?? "OTHER",
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

	if (errorEmployees) return <div>Error loading employees</div>;
	if (errorCars) return <div>Error loading cars</div>;

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

					{/* Category*/}
					<Controller
						control={form.control}
						name="category"
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>
									Category <span className="text-red-500">*</span>
								</FieldLabel>
								<FieldGroup>
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a category" />
										</SelectTrigger>
										<SelectContent>
											{expenseCategories.map((category) => (
												<SelectItem key={category.value} value={category.value}>
													{category.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FieldGroup>
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</Field>
						)}
					/>

					{/* Employee */}
					<Controller
						control={form.control}
						name="paidToId"
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>Employee (Optional)</FieldLabel>
								<FieldGroup>
									<Popover open={isEmployeeOpen} onOpenChange={setEmployeeOpen}>
										<PopoverTrigger asChild>
											<Button
												ref={employeeBtnRef}
												variant="outline"
												role="combobox"
												className={cn(
													"w-full justify-between",
													!field.value && "text-muted-foreground",
												)}
												onClick={() => {
													if (employeeBtnRef.current) {
														setEmployeeBtnWidth(
															employeeBtnRef.current.offsetWidth,
														);
													}
												}}
											>
												{field.value
													? employees.find((emp) => emp.id === field.value)
															?.name
													: "Select employee"}
												<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
											</Button>
										</PopoverTrigger>
										<PopoverContent
											className="p-0"
											style={{
												width: employeeBtnWidth > 0 ? employeeBtnWidth : "auto",
											}}
										>
											{isLoadingEmployees ? (
												<div className="flex items-center justify-center p-4">
													<Loader2 className="h-4 w-4 animate-spin" />
												</div>
											) : (
												<Command>
													<CommandInput placeholder="Search employee name..." />
													<CommandEmpty>No employee found.</CommandEmpty>
													<CommandList
														className="max-h-[300px] overflow-y-auto overscroll-contain"
														onWheel={(e) => e.stopPropagation()}
													>
														<CommandGroup>
															<CommandItem
																value="none"
																onSelect={() => {
																	field.onChange(null);
																	setEmployeeOpen(false);
																}}
															>
																<span className="text-muted-foreground">
																	No employee selected
																</span>
															</CommandItem>
															{employees.map((emp) => (
																<CommandItem
																	value={emp.name}
																	key={emp.id}
																	onSelect={() => {
																		field.onChange(emp.id);
																		setEmployeeOpen(false);
																	}}
																>
																	<span>{emp.name}</span>
																</CommandItem>
															))}
														</CommandGroup>
													</CommandList>
												</Command>
											)}
										</PopoverContent>
									</Popover>
								</FieldGroup>
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</Field>
						)}
					/>

					{/* Car */}
					<Controller
						control={form.control}
						name="carId"
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>Car (Optional)</FieldLabel>
								<FieldGroup>
									<Popover open={isCarOpen} onOpenChange={setCarOpen}>
										<PopoverTrigger asChild>
											<Button
												ref={carBtnRef}
												variant="outline"
												role="combobox"
												className={cn(
													"w-full justify-between",
													!field.value && "text-muted-foreground",
												)}
												onClick={() => {
													if (carBtnRef.current) {
														setCarBtnWidth(carBtnRef.current.offsetWidth);
													}
												}}
											>
												{field.value
													? cars.find((car) => car.id === field.value)?.name
													: "Select car"}
												<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
											</Button>
										</PopoverTrigger>
										<PopoverContent
											className="p-0"
											style={{
												width: carBtnWidth > 0 ? carBtnWidth : "auto",
											}}
										>
											{isLoadingCars ? (
												<div className="flex items-center justify-center p-4">
													<Loader2 className="h-4 w-4 animate-spin" />
												</div>
											) : (
												<Command>
													<CommandInput placeholder="Search car..." />
													<CommandEmpty>No car found.</CommandEmpty>
													<CommandList
														className="max-h-[300px] overflow-y-auto overscroll-contain"
														onWheel={(e) => e.stopPropagation()}
													>
														<CommandGroup>
															<CommandItem
																value="none"
																onSelect={() => {
																	field.onChange(null);
																	setCarOpen(false);
																}}
															>
																<span className="text-muted-foreground">
																	No car selected
																</span>
															</CommandItem>
															{cars.map((car) => (
																<CommandItem
																	value={car.name}
																	key={car.id}
																	onSelect={() => {
																		field.onChange(car.id);
																		setCarOpen(false);
																	}}
																>
																	<div className="flex items-center justify-between w-full">
																		<span>{car.name}</span>
																		{car.color && (
																			<Badge className="ml-2">
																				{car.color}
																			</Badge>
																		)}
																	</div>
																</CommandItem>
															))}
														</CommandGroup>
													</CommandList>
												</Command>
											)}
										</PopoverContent>
									</Popover>
								</FieldGroup>
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</Field>
						)}
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
					onClick={() => form.reset()}
					disabled={
						updateExpenseMutation.isPending || form.formState.isSubmitting
					}
				>
					Clear
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
