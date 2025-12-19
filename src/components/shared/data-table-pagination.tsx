import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

interface DataTablePaginationProps {
	totalRows: number;

	pageSize: number;
	onPageSizeChange: (pageSize: number) => void;

	currentPageIndex: number;
	pageCount: number;

	firstPageButtonOnClick?: () => void;
	firstPageDisabled?: boolean;
	nextPageButtonOnClick?: () => void;
	nextPageDisabled?: boolean;
	previousPageButtonOnClick?: () => void;
	previousPageDisabled?: boolean;
	lastPageButtonOnClick?: () => void;
	lastPageDisabled?: boolean;
}

export default function DataTablePagination({
	totalRows,
	pageSize,
	onPageSizeChange,
	currentPageIndex,
	pageCount,
	firstPageButtonOnClick,
	firstPageDisabled,
	nextPageButtonOnClick,
	nextPageDisabled,
	previousPageButtonOnClick,
	previousPageDisabled,
	lastPageButtonOnClick,
	lastPageDisabled,
}: DataTablePaginationProps) {
	const startRow = currentPageIndex * pageSize + 1;
	const endRow = Math.min((currentPageIndex + 1) * pageSize, totalRows);

	return (
		<div className="flex items-center justify-between mt-4">
			{/* Left */}
			<div className="text-sm text-gray-500 whitespace-nowrap">
				Showing {startRow} to {endRow} of {totalRows} rows
			</div>

			{/*  Right */}
			<div className="flex w-full items-center gap-8 lg:w-fit">
				{/* Rows per page */}
				<div className="hidden items-center gap-2 lg:flex">
					<Label htmlFor="rows-per-page" className="text-sm font-medium">
						Rows per page
					</Label>
					<Select
						value={`${pageSize}`}
						onValueChange={(value) => {
							onPageSizeChange(Number(value));
						}}
					>
						<SelectTrigger size="sm" className="w-20" id="rows-per-page">
							<SelectValue placeholder={pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="ml-auto flex w-fit items-center justify-center text-sm font-medium">
					Page {currentPageIndex + 1} of {pageCount}
				</div>
				<div className="flex items-center gap-2 lg:ml-0">
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={firstPageButtonOnClick}
						disabled={firstPageDisabled}
					>
						<span className="sr-only">Go to first page</span>
						<ChevronsLeft />
					</Button>
					<Button
						variant="outline"
						className="size-8"
						size="icon"
						onClick={previousPageButtonOnClick}
						disabled={previousPageDisabled}
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeft />
					</Button>
					<Button
						variant="outline"
						className="size-8"
						size="icon"
						onClick={nextPageButtonOnClick}
						disabled={nextPageDisabled}
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRight />
					</Button>
					<Button
						variant="outline"
						className="hidden size-8 lg:flex"
						size="icon"
						onClick={lastPageButtonOnClick}
						disabled={lastPageDisabled}
					>
						<span className="sr-only">Go to last page</span>
						<ChevronsRight />
					</Button>
				</div>
			</div>
		</div>
	);
}
