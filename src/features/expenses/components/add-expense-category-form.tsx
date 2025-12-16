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
import { useCreateExpenseCategory } from "../mutations/use-create-expense-category";
import {
	CreateExpenseCategorySchema,
	type CreateExpenseCategoryValues,
} from "../validation";

interface AddExpenseCategoryFormProps {
	onClose: () => void;
}

export default function AddExpenseCategoryForm({
	onClose,
}: AddExpenseCategoryFormProps) {
	const createExpenseCategoryMutation = useCreateExpenseCategory();

	const form = useForm<CreateExpenseCategoryValues>({
		resolver: zodResolver(CreateExpenseCategorySchema),
		defaultValues: {
			name: "",
		},
	});

	const onSubmit = async (values: CreateExpenseCategoryValues) => {
		await createExpenseCategoryMutation.mutateAsync(values);
		form.reset();
		onClose();
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
			<FieldSet>
				<FieldGroup>
					{/* Name*/}
					<Controller
						control={form.control}
						name="name"
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>
									Name <span className="text-red-500">*</span>
								</FieldLabel>
								<FieldGroup>
									<Input placeholder="Enter expense category name" {...field} />
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
						createExpenseCategoryMutation.isPending ||
						form.formState.isSubmitting
					}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={
						createExpenseCategoryMutation.isPending ||
						form.formState.isSubmitting
					}
				>
					{createExpenseCategoryMutation.isPending
						? "Saving..."
						: "Create"}
				</Button>
			</div>
		</form>
	);
}
