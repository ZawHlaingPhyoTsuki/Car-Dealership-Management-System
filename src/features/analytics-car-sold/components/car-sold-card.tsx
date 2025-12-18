import type { LucideIcon } from "lucide-react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAmountInLakhs, getMonthName, getYearName } from "@/lib/utils";

interface SoldAnalyticsCardProps {
	label: string;
	amount: number;
	period: "month" | "year";
	numPeriod: number;
	icon: LucideIcon;
	amountColor?: string;
	suffix?: string;
}

export default function SoldAnalyticsCard({
	label,
	amount,
	period,
	numPeriod,
	icon: Icon,
	amountColor = "text-green-500",
	suffix = "",
}: SoldAnalyticsCardProps) {
	return (
		<Card className="@container/card">
			<CardHeader>
				<CardTitle
					className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${amountColor}`}
				>
					{suffix ? formatAmountInLakhs(amount) : `${amount}`}
					{suffix && (
						<span className="text-[20px] text-muted-foreground"> {suffix}</span>
					)}
				</CardTitle>
			</CardHeader>

			<CardFooter className="flex items-center justify-between text-muted-foreground">
				<div className="flex items-center gap-2">
					<Icon className="w-4 h-4" />
					{label}
				</div>
				{period === "month" && getMonthName(numPeriod)}
				{period === "year" && getYearName(numPeriod)}
			</CardFooter>
		</Card>
	);
}
