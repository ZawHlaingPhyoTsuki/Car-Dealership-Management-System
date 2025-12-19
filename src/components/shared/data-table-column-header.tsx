import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, X } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>;
	}

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="data-[state=open]:bg-accent -ml-3 h-8"
					>
						<Label className="text-lg">{title}</Label>
						{column.getIsSorted() === "desc" ? (
							<ArrowDown />
						) : column.getIsSorted() === "asc" ? (
							<ArrowUp />
						) : (
							<ChevronsUpDown />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
						<ArrowUp className="mr-2 h-4 w-4" />
						Asc
					</DropdownMenuItem>

					<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
						<ArrowDown className="mr-2 h-4 w-4" />
						Desc
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => column.clearSorting()}>
						<X className="mr-2 h-4 w-4" />
						Reset
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
