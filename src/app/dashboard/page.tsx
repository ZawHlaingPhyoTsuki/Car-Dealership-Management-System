import type { Metadata } from "next";
import DashboardCards from "@/components/dashboard/dashboard-cards";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Business dashboard",
};

export default function DashboardPage() {
	return (
		<div>
			<DashboardCards />
		</div>
	);
}
