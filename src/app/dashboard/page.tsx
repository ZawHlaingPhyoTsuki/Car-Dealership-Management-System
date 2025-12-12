import type { Metadata } from "next";
import DashboardCards from "@/components/dashboard/dashboard-cards";
import { DataTable } from "@/components/sidebar/data-table";
import data from "./data.json";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Business dashboard",
};

export default function DashboardPage() {
	return (
		<div>
			<DashboardCards />
			<DataTable data={data} />
		</div>
	);
}
