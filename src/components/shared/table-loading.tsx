import { Loader2 } from "lucide-react";

export default function TableLoading({ label }: { label?: string }) {
	return (
		<div className="flex items-center justify-center" aria-live="polite">
			<div className="flex flex-col items-center gap-2">
				<Loader2 className="h-8 w-8 mt-12 animate-spin" />
				{label && (
					<p
						className="text-muted-foreground text-sm text-center"
						aria-live="polite"
					>
						{label}
					</p>
				)}
			</div>
		</div>
	);
}
