"use client";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import React, { useState } from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";
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
} from "@/components/ui/field";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type FormPopoverSelectProps<TFieldValues extends FieldValues, TItem> = {
	control: Control<TFieldValues>;
	selector: string;
	name: Path<TFieldValues>;
	label: string;

	items: TItem[];
	isLoading?: boolean;
	isError?: boolean;
	allowNone?: boolean;

	matchTriggerWidth?: boolean;

	getLabel: (item: TItem) => string;
	getValue: (item: TItem) => string;
	getSubLabel?: (item: TItem) => string | undefined;
	onDone?: () => void;
};

function FormPopoverSelect<TFieldValues extends FieldValues, TItem>({
	control,
	selector,
	name,
	label,
	items,
	isLoading = false,
	isError = false,
	allowNone,
	matchTriggerWidth = false,
	getLabel,
	getValue,
	getSubLabel,
	onDone,
}: FormPopoverSelectProps<TFieldValues, TItem>) {
	const [open, setOpen] = useState(false);
	const triggerRef = React.useRef<HTMLButtonElement>(null);
	const [triggerWidth, setTriggerWidth] = React.useState<number>();

	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => {
				if (isError) {
					return (
						<Field>
							<FieldLabel>{label}</FieldLabel>
							<div className="text-sm text-destructive">
								Error loading {selector}
							</div>
						</Field>
					);
				}

				const selectedItem = items?.find(
					(item) => getValue(item) === field.value,
				);

				return (
					<Field>
						<FieldLabel>{label}</FieldLabel>
						<FieldGroup>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button
										ref={triggerRef}
										variant="outline"
										role="combobox"
										aria-expanded={open}
										className={cn(
											"w-full justify-between",
											!field.value && "text-muted-foreground",
										)}
										onClick={() => {
											if (matchTriggerWidth && triggerRef.current) {
												setTriggerWidth(triggerRef.current.offsetWidth);
											}
										}}
									>
										{selectedItem
											? getLabel(selectedItem)
											: `Select ${selector}`}
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="p-0"
									style={
										matchTriggerWidth && triggerWidth
											? { width: triggerWidth }
											: undefined
									}
								>
									{isLoading ? (
										<div className="flex items-center justify-center p-4">
											<Loader2 className="h-4 w-4 animate-spin" />
										</div>
									) : (
										<Command>
											<CommandInput
												placeholder={`Search ${label.toLowerCase()}...`}
											/>
											<CommandEmpty>No results found</CommandEmpty>
											<CommandList
												className="max-h-[300px] overflow-y-auto overscroll-contain"
												onWheel={(e) => e.stopPropagation()}
											>
												<CommandGroup>
													{allowNone && (
														<CommandItem
															value="none"
															onSelect={() => {
																field.onChange(null);
																setOpen(false);
																onDone?.();
															}}
														>
															<Check
																className={cn(
																	"mr-2 h-4 w-4",
																	!field.value ? "opacity-100" : "opacity-0",
																)}
															/>
															<div className="flex flex-col">
																<span>No {selector}</span>
																<span className="text-xs text-muted-foreground">
																	Remove {selector}
																</span>
															</div>
														</CommandItem>
													)}
													{items.map((item) => {
														const value = getValue(item);

														return (
															<CommandItem
																value={getLabel(item)}
																key={value}
																onSelect={() => {
																	field.onChange(value);
																	setOpen(false);
																}}
															>
																<Check
																	className={cn(
																		"mr-2 h-4 w-4",
																		field.value === value
																			? "opacity-100"
																			: "opacity-0",
																	)}
																/>
																<div className="w-full space-y-1">
																	<div className="">
																		<span>{getLabel(item)}</span>
																		{getSubLabel && (
																			<span className="block text-sm text-muted-foreground">
																				{getSubLabel(item)}
																			</span>
																		)}
																	</div>
																</div>
															</CommandItem>
														);
													})}
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
				);
			}}
		/>
	);
}

export default FormPopoverSelect;
