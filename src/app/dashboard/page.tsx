"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
	const router = useRouter();

	return (
		<div>
			<h1>DashboardPage</h1>
			<Button
				variant="destructive"
				onClick={async () => {
					await authClient.signOut({
						fetchOptions: {
							onSuccess: () => {
								router.push("/login");
							},
						},
					});
				}}
			>
				Logout
			</Button>
		</div>
	);
}
