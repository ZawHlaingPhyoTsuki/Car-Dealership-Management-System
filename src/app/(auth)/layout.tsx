import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ModeSwitcher } from "@/components/shared/mode-switcher";
import { paths } from "@/config/paths";
import { auth } from "@/lib/auth";

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		redirect(paths.dashboard.root.getHref());
	}

	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10 md:pt-5">
				<div className="flex items-center justify-between">
					<div className="flex justify-center gap-2 md:justify-start">
						<Link
							href={paths.dashboard.root.getHref()}
							className="flex items-center gap-2 font-medium text-2xl"
						>
							<Image
								src="/images/logo.jpg"
								width={50}
								height={50}
								className="rounded-full overflow-hidden"
								alt="Logo"
							/>
							7hrs Automobile
						</Link>
					</div>
					<ModeSwitcher />
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs">{children}</div>
				</div>
			</div>
			<div className="relative hidden bg-black lg:block">
				<Image
					fill
					src="/images/main.webp"
					alt="Background Photo"
					className="object-cover opacity-80"
					sizes="100vw"
					priority
				/>
				<div className="absolute inset-0 bg-linear-to-t from-black/75 to-transparent"></div>
			</div>
		</div>
	);
}
