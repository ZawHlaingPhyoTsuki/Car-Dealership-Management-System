"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateCarSharer } from "../mutations/use-create-car-sharer";
import {
	CreateCarSharerSchema,
	type CreateCarSharerValues,
} from "../validation";

interface AddCarFormProps {
	onClose?: () => void;
}

export default function AddCarSharerForm({ onClose }: AddCarFormProps) {
	const createCarSharerMutation = useCreateCarSharer();

	const form = useForm<CreateCarSharerValues>({
		resolver: zodResolver(CreateCarSharerSchema),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			notes: "",
		},
	});

	const onSubmit = async (values: CreateCarSharerValues) => {
		await createCarSharerMutation.mutateAsync(values);
		form.reset();
		onClose?.();
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
							<Field
								data-invalid={fieldState.invalid}
								className="md:col-span-2"
							>
								<FieldLabel htmlFor="name">
									Shareholder Name <span className="text-red-500">*</span>
								</FieldLabel>
								<Input id="name" placeholder="John Doe" {...field} />
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
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									placeholder="john.doe@example.com"
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
								<FieldLabel htmlFor="phone">Phone</FieldLabel>
								<Input id="phone" placeholder="123-456-7890" {...field} />
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</Field>
						)}
					/>
				</FieldGroup>

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
						createCarSharerMutation.isPending || form.formState.isSubmitting
					}
				>
					Clear
				</Button>
				<Button
					type="submit"
					disabled={
						createCarSharerMutation.isPending || form.formState.isSubmitting
					}
				>
					{createCarSharerMutation.isPending ? "Saving..." : "Save Shareholder"}
				</Button>
			</div>
		</form>
	);
}
