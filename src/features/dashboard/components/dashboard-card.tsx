import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export interface DashboardCardProps {
	description: string;
	icon: LucideIcon;
	value: ReactNode;
	badge?: ReactNode;
	footerTitle: ReactNode;
	footerSubtitle: string;
	className?: string;
}

export default function DashboardCard({
	description,
	icon: Icon,
	value,
	badge,
	footerTitle,
	footerSubtitle,
	className = "",
}: DashboardCardProps) {
	return (
		<Card className={`@container/card ${className}`}>
			<CardHeader>
				<CardDescription className="flex items-center gap-2">
					<Icon className="w-4 h-4" />
					{description}
				</CardDescription>
				<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
					{value}
				</CardTitle>
				{badge && <CardAction>{badge}</CardAction>}
			</CardHeader>
			<CardFooter className="flex-col items-start gap-1.5 text-sm">
				<div className="line-clamp-1 flex gap-2 font-medium">{footerTitle}</div>
				<div className="text-muted-foreground">{footerSubtitle}</div>
			</CardFooter>
		</Card>
	);
}
