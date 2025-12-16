import { endOfDayLocal, startOfDayLocal } from "./date-utils";

export function getPresetRange(preset: "today" | "month" | "last30" | "year") {
	const now = new Date();

	switch (preset) {
		case "today": {
			return {
				from: startOfDayLocal(now),
				to: endOfDayLocal(now),
			};
		}

		case "month": {
			const from = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the current month
			const to = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of the current month
			return {
				from: startOfDayLocal(from),
				to: endOfDayLocal(to),
			};
		}

		case "year": {
			const from = new Date(now.getFullYear(), 0, 1); // Start of the current year
			const to = new Date(now.getFullYear(), 11, 31); // End of the current year
			return {
				from: startOfDayLocal(from),
				to: endOfDayLocal(to),
			};
		}

		case "last30": {
			const from = new Date();
			from.setDate(from.getDate() - 30);
			return {
				from: startOfDayLocal(from),
				to: endOfDayLocal(now),
			};
		}
	}
}
