import { DataTable } from "@/components/sidebar/data-table";
import { SectionCards } from "@/components/sidebar/section-cards";
import data from "../data.json";

export default function AnalyticsPage() {
	return (
		<div>
			<SectionCards />
			<DataTable data={data} />
		</div>
	);
}
