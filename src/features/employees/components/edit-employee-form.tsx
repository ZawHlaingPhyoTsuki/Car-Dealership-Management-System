"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { useUpdateEmployee } from "../mutations/use-update-employee";
import type { EmployeeTableData } from "./columns";

export const UpdateEmployeeSchema = z.object({
	name: z.string().min(3, "Name must be at least 3 characters."),
	email: z.email("Invalid email address."),
	position: z.string().min(3, "Position is required."),
	salary: z.number().min(1, "Salary must be at least 1."),
	phone: z.string().min(10, "Phone must be at least 10 characters.").optional(),
	address: z
		.string()
		.min(3, "Address must be at least 3 characters.")
		.optional(),
});

type UpdateEmployeeValues = z.infer<typeof UpdateEmployeeSchema>;

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
			name: employee.name,
			email: employee.email,
			position: employee.position,
			phone: employee.phone ?? undefined,
			address: employee.address ?? undefined,
			salary: employee.salary,
		},
	});

	const onSubmit = (data: UpdateEmployeeValues) => {
		updateEmployeeMutation.mutateAsync({
			id: employee.id,
			data,
		});
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

					{/* Email */}
					<Controller
						name="email"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="email">Email Address</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder="john.doe@company.com"
									required
									{...field}
								/>
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
									required
									{...field}
								/>
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</Field>
						)}
					/>

					{/* Phone */}
					<Controller
						name="phone"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="phone">Phone Number</FieldLabel>
								<Input id="phone" placeholder="+1 (555) 123-4567" {...field} />
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
										required
										{...field}
										onChange={(e) => {
											const value = e.target.value;
											const num = value === "" ? null : Number(value);
											field.onChange(num);
										}}
										value={field.value || ""}
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
				</FieldGroup>

				{/* Address - Full width */}
				<Controller
					name="address"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="address">Address</FieldLabel>
							<Textarea
								id="address"
								placeholder="123 Main St, City, State, ZIP Code"
								rows={3}
								{...field}
							/>
							{fieldState.error && (
								<FieldError>{fieldState.error.message}</FieldError>
							)}
						</Field>
					)}
				/>
			</FieldSet>

			{/* Form Actions */}
			<div className="flex justify-end gap-3 pt-4 border-t">
				<Button
					type="button"
					variant="outline"
					onClick={() => form.reset()}
					disabled={
						updateEmployeeMutation.isPending || form.formState.isSubmitting
					}
				>
					Clear
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
