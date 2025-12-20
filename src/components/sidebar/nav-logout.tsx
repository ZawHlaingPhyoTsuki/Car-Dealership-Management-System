"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";

export default function NavLogout() {
	const router = useRouter();

	return (
		<>
			<div className="flex items-center opacity-80 mb-6">
				<Image
					alt="Banana Coder Avatar"
					src="/images/banana-coder.jpg"
					height={40}
					width={40}
					className="object-cover rounded-full"
				/>
				<div>
					<span className="text-xs text-muted-foreground">powered by</span>
					<p className="-mt-1 font-serif">
						Banana Coder <sup className="text-muted-foreground">&copy;</sup>
					</p>
				</div>
			</div>
			<Button
				variant="outline"
				onClick={() =>
					authClient.signOut({
						fetchOptions: {
							onSuccess: () => {
								router.replace(paths.login.getHref());
							},
						},
					})
				}
			>
				<LogOut />
				Logout
			</Button>
		</>
	);
}
