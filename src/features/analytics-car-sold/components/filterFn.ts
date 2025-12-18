import type { FilterFn } from "@tanstack/react-table";
import type { Duration } from "./car-sold-table";

// biome-ignore lint: false positive
export const monthYearFilter: FilterFn<any> = (
	row,
	columnId: string,
	duration: Duration,
): boolean => {
	const soldDate = row.getValue(columnId) as Date;
	if (!soldDate) return false;

	const date = new Date(soldDate);
	const month = date.getMonth();
	const year = date.getFullYear();

	return month === duration.month && year === duration.year;
};
