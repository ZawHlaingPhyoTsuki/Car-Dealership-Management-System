"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { useUpdateEmployee } from "../mutations/use-update-employee";
import { UpdateEmployeeSchema, type UpdateEmployeeValues } from "../validation";
import type { EmployeeTableData } from "./columns";
import { parseAmountInput, parsePercentageInput } from "@/lib/utils";

interface EditEmployeeFormProps {
	onClose: () => void;
	employee: EmployeeTableData;
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
			position: employee.position,
			salary: employee.salary,
			percentage: employee.percentage,
			startDate: employee.startDate,
		},
	});

	const onSubmit = async (data: UpdateEmployeeValues) => {
		await updateEmployeeMutation.mutateAsync(data);
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
										min="0"
										placeholder="50000"
										{...field}
										onChange={(e) => {
											field.onChange(
												parseAmountInput(
													e.target.value,
													field.value !== undefined ? field.value : undefined,
												),
											);
										}}
										value={field.value ?? ""}
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
										max="100"
										placeholder="50"
										{...field}
										onChange={(e) => {
											const val = parsePercentageInput(e.target.value);
											field.onChange(val);
										}}
										value={field.value ?? ""}
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
								<InputGroup>
									<InputGroupInput
										id="startDate"
										type="date"
										{...field}
										value={
											field.value
												? format(new Date(field.value), "yyyy-MM-dd")
												: ""
										}
										onChange={(e) => {
											const dateValue = e.target.value;
											field.onChange(
												dateValue
													? new Date(`${dateValue}T00:00:00`)
													: undefined,
											);
										}}
									/>
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
						onClose?.();
						form.reset();
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
