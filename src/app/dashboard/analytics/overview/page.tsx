import type { Metadata } from "next";

import { DataTable } from "@/components/sidebar/data-table";
import { SectionCards } from "@/components/sidebar/section-cards";
import data from "../../data.json";

export const metadata: Metadata = {
	title: "Analytics",
	description: "Business analytics dashboard",
};

export default function AnalyticsOverviewPage() {
	return (
		<div>
			<SectionCards />
			<DataTable data={data} />
		</div>
	);
}
