"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
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
import { cn, normalizeNumberInput } from "@/lib/utils";
import type { Employee } from "../actions/get-employees";
import { useUpdateEmployee } from "../mutations/use-update-employee";
import { UpdateEmployeeSchema, type UpdateEmployeeValues } from "../validation";

interface EditEmployeeFormProps {
	onClose: () => void;
	employee: Employee;
}

export default function EditEmployeeForm({
	onClose,
	employee,
}: EditEmployeeFormProps) {
	const updateEmployeeMutation = useUpdateEmployee();

	const form = useForm<UpdateEmployeeValues>({
		resolver: zodResolver(UpdateEmployeeSchema),
		defaultValues: {
			id: employee.id,
			name: employee.name,
			position: employee.position ?? undefined,
			salary: employee.salary ?? undefined,
			percentage: employee.percentage,
			startDate: employee.startDate,
		},
	});

	const onSubmit = async (values: UpdateEmployeeValues) => {
		await updateEmployeeMutation.mutateAsync(values);
		form.reset();
		onClose();
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
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="name">Full Name</FieldLabel>
								<Input id="name" placeholder="John Doe" required {...field} />
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</Field>
						)}
					/>

					{/* Position */}
					<Controller
						name="position"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="position">Position</FieldLabel>
								<Input
									id="position"
									placeholder="Software Engineer"
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

					{/* Salary */}
					<Controller
						name="salary"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="salary">Salary</FieldLabel>
								<InputGroup>
									<InputGroupInput
										id="salary"
										type="number"
										step="1"
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
									<InputGroupAddon>
										<span className="text-gray-500">Ks</span>
									</InputGroupAddon>
								</InputGroup>
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</Field>
						)}
					/>

					{/* Percentage */}
					<Controller
						name="percentage"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="percentage">Percentage</FieldLabel>
								<InputGroup>
									<InputGroupInput
										id="percentage"
										type="number"
										step="1"
										min="0"
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
									<InputGroupAddon>
										<span className="text-gray-500">%</span>
									</InputGroupAddon>
								</InputGroup>
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</Field>
						)}
					/>

					{/* Start Date */}
					<Controller
						name="startDate"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="startDate">Start Date</FieldLabel>
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
													format(field.value, "PPP")
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
												disabled={{
													after: new Date(),
													before: new Date("1900-01-01"),
												}}
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
					disabled={
						updateEmployeeMutation.isPending || form.formState.isSubmitting
					}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={
						updateEmployeeMutation.isPending || form.formState.isSubmitting
					}
				>
					{updateEmployeeMutation.isPending ? "Saving..." : "Save Changes"}
				</Button>
			</div>
		</form>
	);
}
