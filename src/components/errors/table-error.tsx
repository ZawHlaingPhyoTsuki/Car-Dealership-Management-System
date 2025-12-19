import { Button } from "../ui/button";

export default function TableError({
	label,
	onRetry,
}: {
	label: string;
	onRetry: () => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<p className="text-destructive mb-4">Failed to load {label}</p>
			<Button onClick={onRetry} variant="outline">
				Retry
			</Button>
		</div>
	);
}
