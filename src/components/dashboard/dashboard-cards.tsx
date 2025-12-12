import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { BanknoteArrowUp, CarFront, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function DashboardCards() {
	return (
		<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
			<Card className="@container/card">
				<CardHeader>
					<CardDescription className="flex items-center gap-2">
						<CarFront className="w-4 h-4" />
						Car Sales
					</CardDescription>

					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-green-500">
						30
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<IconTrendingUp />
							+12.5%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Selling up this month <IconTrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">
						More sales than last month
					</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<CardDescription className="flex items-center gap-2">
						<DollarSign className="w-4 h-4" /> Profit Overview
					</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-green-500">
						12345.5 <span className="text-xl text-muted-foreground">lakhs</span>
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<IconTrendingUp />
							+20%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Up 20% this period <IconTrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">Did a great job</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<CardDescription className="flex items-center gap-2">
						<BanknoteArrowUp className="w-4 h-4" /> Total Expenses
					</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-green-500">
						45.5 <span className="text-xl text-muted-foreground">lakhs</span>
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<IconTrendingDown />
							-12.5%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Good spending <IconTrendingDown className="size-4" />
					</div>
					<div className="text-muted-foreground">Less than earlier month</div>
				</CardFooter>
			</Card>
		</div>
	);
}
