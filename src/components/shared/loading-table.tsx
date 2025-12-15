import { Loader2 } from "lucide-react";

export default function LoadingTable({ label }: { label?: string }) {
	return (
		<div className="flex items-center justify-center">
			<div className="flex flex-col items-center gap-2">
				<Loader2 className="h-6 w-6 mt-12 animate-spin" />
				{label && (
					<p className="text-muted-foreground text-sm text-center">{label}</p>
				)}
			</div>
		</div>
	);
}
