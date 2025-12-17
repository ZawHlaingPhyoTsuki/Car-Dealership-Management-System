"use client";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
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

type BasePopoverSelectProps<TItem> = {
	selector: string;
	label?: string;
	items: TItem[];
	isLoading?: boolean;
	isError?: boolean;
	allowNone?: boolean;
	matchTriggerWidth?: boolean;
	customLabel?: string;
	customSubLabel?: string;
	getLabel: (item: TItem) => string;
	getValue: (item: TItem) => string;
	getSubLabel?: (item: TItem) => string | undefined;
	onClear?: () => void;
	error?: string;
};

type FormPopoverSelectProps<
	TFieldValues extends FieldValues,
	TItem,
> = BasePopoverSelectProps<TItem> & {
	control: Control<TFieldValues>;
	name: Path<TFieldValues>;
	value?: never;
	onChange?: never;
};

type StandalonePopoverSelectProps<TItem> = BasePopoverSelectProps<TItem> & {
	value: string | null | undefined;
	onChange: (value: string | null) => void;
	control?: never;
	name?: never;
};

type PopoverSelectProps<TFieldValues extends FieldValues, TItem> =
	| FormPopoverSelectProps<TFieldValues, TItem>
	| StandalonePopoverSelectProps<TItem>;

function PopoverSelectContent<TItem>({
	selector,
	label,
	items,
	isLoading = false,
	isError = false,
	allowNone,
	matchTriggerWidth = false,
	customLabel,
	customSubLabel,
	getLabel,
	getValue,
	getSubLabel,
	onClear,
	value,
	onChange,
	error,
}: BasePopoverSelectProps<TItem> & {
	value: string | null | undefined;
	onChange: (value: string | null) => void;
}) {
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const [triggerWidth, setTriggerWidth] = useState<number>();

	if (isError) {
		return (
			<Field>
				<FieldLabel>{label}</FieldLabel>
				<div className="text-sm text-destructive">Error loading {selector}</div>
			</Field>
		);
	}

	const selectedItem = items.find((item) => getValue(item) === value);

	return (
		<Field>
			{label && <FieldLabel>{label}</FieldLabel>}
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
								!value && "text-muted-foreground",
							)}
							onClick={() => {
								if (matchTriggerWidth && triggerRef.current && !open) {
									setTriggerWidth(triggerRef.current.offsetWidth);
								}
							}}
						>
							<p className="overflow-hidden">
								{selectedItem ? getLabel(selectedItem) : `Select ${selector}`}
							</p>
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
									placeholder={`Search ${selector.toLowerCase()}...`}
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
													onChange(null);
													setOpen(false);
													onClear?.();
												}}
											>
												<Check
													className={cn(
														"mr-2 h-4 w-4",
														!value ? "opacity-100" : "opacity-0",
													)}
												/>
												<div className="flex flex-col">
													{customLabel && customSubLabel ? (
														<>
															<span>{customLabel}</span>
															<span className="text-xs text-muted-foreground">
																{customSubLabel}
															</span>
														</>
													) : (
														<>
															<span>No {selector}</span>
															<span className="text-xs text-muted-foreground">
																Remove {selector}
															</span>
														</>
													)}
												</div>
											</CommandItem>
										)}
										{items.map((item) => {
											const itemValue = getValue(item);

											return (
												<CommandItem
													value={getLabel(item)}
													key={itemValue}
													onSelect={() => {
														onChange(itemValue);
														setOpen(false);
													}}
												>
													<Check
														className={cn(
															"mr-2 h-4 w-4",
															value === itemValue ? "opacity-100" : "opacity-0",
														)}
													/>
													<div className="w-full space-y-1">
														<div>
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
			{error && <FieldError>{error}</FieldError>}
		</Field>
	);
}

function PopoverSelect<TFieldValues extends FieldValues, TItem>(
	props: PopoverSelectProps<TFieldValues, TItem>,
) {
	// Form mode
	if ("control" in props && props.control) {
		const { control, name, ...restProps } = props;
		return (
			<Controller
				control={control}
				name={name}
				render={({ field, fieldState }) => (
					<PopoverSelectContent
						{...restProps}
						value={field.value}
						onChange={field.onChange}
						error={fieldState.error?.message}
					/>
				)}
			/>
		);
	}

	// Standalone mode
	const { value, onChange, ...restProps } =
		props as StandalonePopoverSelectProps<TItem>;
	return (
		<PopoverSelectContent {...restProps} value={value} onChange={onChange} />
	);
}

export default PopoverSelect;
