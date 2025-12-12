import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CarDetailLoading() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
				<div className="space-y-2">
					<Skeleton className="h-8 w-64" />
					<Skeleton className="h-6 w-32" />
				</div>
				<div className="flex gap-2">
					<Skeleton className="h-10 w-32" />
					<Skeleton className="h-10 w-32" />
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<Card>
						<CardContent className="p-0">
							<Skeleton className="h-[500px] w-full" />
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-40" />
							<Skeleton className="h-4 w-24" />
						</CardHeader>
						<CardContent className="space-y-4">
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="space-y-2">
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-6 w-full" />
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
