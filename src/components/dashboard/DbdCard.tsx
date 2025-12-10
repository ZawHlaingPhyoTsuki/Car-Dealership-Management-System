"use client";

import {
	ArrowDownLeft,
	ArrowUpRight,
	type LucideIcon,
	SquareArrowOutUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
	Card,
	CardAction,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface DbdCardProps {
	icon: LucideIcon;
	title: string;
	// amount: number;
	amount: string;
	plus: boolean;
	url: string;
	numColor?: string;
}

function DbdCard({
	icon: Icon,
	title,
	amount,
	plus,
	url,
	numColor,
}: DbdCardProps) {
	const router = useRouter();

	return (
		<Card
			className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
			onClick={() => router.push(url)}
		>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Icon className="h-4 w-4" />
					<p>{title}</p>
				</CardTitle>
				<CardAction>
					<SquareArrowOutUpRight
						className={`h-4 w-4 group-hover:scale-110 transition-transform duration-300`}
					/>
				</CardAction>
			</CardHeader>

			<CardFooter className="flex items-center justify-between gap-3">
				<div className="flex items-end gap-2">
					{plus ? (
						<ArrowUpRight className="h-10 w-10 text-green-500" />
					) : (
						<ArrowDownLeft className={`h-10 w-10 text-red-500`} />
					)}
					<span className="text-sm text-muted-foreground">This month</span>
				</div>
				<p className={`text-4xl font-bold ${numColor ?? ""}`}>{amount}</p>
			</CardFooter>
		</Card>
	);
}

export default DbdCard;
