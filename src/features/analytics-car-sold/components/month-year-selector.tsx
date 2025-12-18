import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn, months } from "@/lib/utils";

interface MonthYearSelectorProps {
	value: { month: number; year: number };
	onChange: (value: { month: number; year: number }) => void;
	className?: string;
}

export function MonthYearSelector({
	value,
	onChange,
	className,
}: MonthYearSelectorProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [currentView, setCurrentView] = useState({
		month: value.month,
		year: value.year,
	});

	useEffect(() => {
		setCurrentView({ month: value.month, year: value.year });
	}, [value.month, value.year]);

	const handlePrevYear = () => {
		setCurrentView((prev) => ({ ...prev, year: prev.year - 1 }));
	};

	const handleNextYear = () => {
		setCurrentView((prev) => ({ ...prev, year: prev.year + 1 }));
	};

	const handleMonthSelect = (month: number) => {
		onChange({ month, year: currentView.year });
		setIsOpen(false);
	};

	const formatDisplay = () => {
		return `${months[value.month]} ${value.year}`;
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"w-[200px] justify-start text-left font-normal",
						className,
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{formatDisplay()}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80 p-0" align="start">
				<div className="p-3">
					{/* Year Navigation */}
					<div className="flex items-center justify-between mb-4">
						<Button
							variant="ghost"
							size="icon"
							onClick={handlePrevYear}
							className="h-7 w-7"
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<div className="font-semibold text-lg">{currentView.year}</div>
						<Button
							variant="ghost"
							size="icon"
							onClick={handleNextYear}
							className="h-7 w-7"
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>

					{/* Month Grid */}
					<div className="grid grid-cols-3 gap-2">
						{months.map((month, index) => (
							<Button
								key={month}
								variant="ghost"
								className={cn(
									"h-9",
									value.month === index && currentView.year === value.year
										? "bg-primary text-primary-foreground hover:bg-primary/90"
										: "hover:bg-accent",
								)}
								onClick={() => handleMonthSelect(index)}
							>
								{month.slice(0, 3)}
							</Button>
						))}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
