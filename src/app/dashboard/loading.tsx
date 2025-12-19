export default function DashboardLoading() {
	return (
		<div className="flex h-screen items-center justify-center">
			<div className="text-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
				<p className="mt-4 text-muted-foreground">Loading dashboard...</p>
			</div>
		</div>
	);
}
