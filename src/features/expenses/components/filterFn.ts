import type { FilterFn } from "@tanstack/react-table";

// biome-ignore lint/suspicious/noExplicitAny: <any>
export const dateBetweenFilter: FilterFn<any> = (
	row,
	columnId,
	value: { from?: Date; to?: Date },
) => {
	const rowDate = row.getValue<Date>(columnId);
	if (!rowDate) return false;

	const time = new Date(rowDate).getTime();

	const from = value?.from ? value.from.getTime() : undefined;
	const to = value?.to ? value.to.getTime() : undefined;

	if (from && time < from) return false;
	if (to && time > to) return false;

	return true;
};
