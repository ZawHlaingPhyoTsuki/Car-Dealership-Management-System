"use client";

import {
	endOfDay,
	endOfMonth,
	endOfWeek,
	endOfYear,
	startOfDay,
	startOfMonth,
	startOfWeek,
	startOfYear,
	subDays,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { getDefaultClassNames, type DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangePopoverProps {
	value?: DateRange;
	onChange: (range?: DateRange) => void;
}

export function DateRangePopover({ value, onChange }: DateRangePopoverProps) {
	const [selectedRange, setSelectedRange] = useState<string | null>();

	const today = new Date();

	const dateRanges = [
		{
			label: "Today",
			start: startOfDay(today),
			end: endOfDay(today),
		},
		{
			label: "Yesterday",
			start: startOfDay(subDays(today, 1)),
			end: endOfDay(subDays(today, 1)),
		},
		{
			label: "This Week",
			start: startOfWeek(today, { weekStartsOn: 1 }),
			end: endOfWeek(today, { weekStartsOn: 1 }),
		},
		{
			label: "Last Week",
			start: startOfWeek(subDays(today, 7), { weekStartsOn: 1 }),
			end: endOfWeek(subDays(today, 7), { weekStartsOn: 1 }),
		},
		{
			label: "Last 7 Days",
			start: startOfDay(subDays(today, 6)),
			end: endOfDay(today),
		},
		{
			label: "This Month",
			start: startOfMonth(today),
			end: endOfMonth(today),
		},
		{
			label: "Last Month",
			start: startOfMonth(subDays(today, today.getDate())),
			end: endOfMonth(subDays(today, today.getDate())),
		},
		{
			label: "This Year",
			start: startOfYear(today),
			end: endOfYear(today),
		},
		{
			label: "Last Year",
			start: startOfYear(subDays(today, 365)),
			end: endOfYear(subDays(today, 365)),
		},
	];

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline">
					<CalendarIcon className="mr-2 h-4 w-4" />
					Select A Date
				</Button>
			</PopoverTrigger>

			<PopoverContent align="start" className="w-auto bg-sidebar">
				<div className="flex">
					{/* Presets */}
					<div className="flex flex-col gap-1 pr-4 text-left border-r border-foreground/10">
						{dateRanges.map(({ label, start, end }) => (
							<Button
								key={label}
								variant="ghost"
								size="default"
								className={cn(
									"justify-start",
									selectedRange === label &&
										"bg-accent text-accent-foreground dark:bg-accent/50",
								)}
								onClick={() => {
									setSelectedRange(label);
									onChange({ from: start, to: end });
								}}
							>
								{label}
							</Button>
						))}
					</div>

					{/* Calendar */}
					<Calendar
						mode="range"
						selected={value}
						onSelect={onChange}
						numberOfMonths={2}
						showOutsideDays={false}
						classNames={{
							root: `${getDefaultClassNames().root} bg-sidebar p-3`,
							day_button:
								"h-9 w-9 text-base font-medium hover:bg-accent hover:text-accent-foreground",
							caption_label: "text-lg font-bold",
						}}
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}
