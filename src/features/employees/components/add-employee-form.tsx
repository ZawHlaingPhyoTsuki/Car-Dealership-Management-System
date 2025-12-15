"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
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
import { useCreateEmployee } from "../mutations/use-create-employee";
import { CreateEmployeeSchema, type CreateEmployeeValues } from "../validation";

interface AddEmployeeFormProps {
	onClose: () => void;
}

export default function AddEmployeeForm({ onClose }: AddEmployeeFormProps) {
	const createEmployeeMutation = useCreateEmployee();

	const form = useForm<CreateEmployeeValues>({
		resolver: zodResolver(CreateEmployeeSchema),
		defaultValues: {
			name: "",
			position: "",
			salary: 0,
			percentage: 0,
			startDate: new Date(),
		},
	});

	const onSubmit = async (values: CreateEmployeeValues) => {
		await createEmployeeMutation.mutateAsync(values);
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
								<FieldLabel htmlFor="name">
									Full Name <span className="text-red-500">*</span>
								</FieldLabel>
								<Input id="name" placeholder="John Doe" {...field} />
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
											const value = e.target.value;
											field.onChange(value === "" ? 0 : Number(value));
										}}
										value={field.value}
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
											const value = e.target.value;
											field.onChange(value === "" ? undefined : Number(value));
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
												dateValue ? parseISO(dateValue) : undefined,
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
						form.reset();
						onClose?.();
					}}
					disabled={
						createEmployeeMutation.isPending || form.formState.isSubmitting
					}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={
						createEmployeeMutation.isPending || form.formState.isSubmitting
					}
				>
					{createEmployeeMutation.isPending ? "Saving..." : "Save Changes"}
				</Button>
			</div>
		</form>
	);
}
