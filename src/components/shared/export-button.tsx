import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TableExportButtonProp {
	disabled?: boolean;
	buttonText?: string;
	onClick: () => void;
	variant?:
		| "default"
		| "link"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost";
	size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
}

export function TableExportButton({
	disabled = false,
	buttonText = "Export as Excel",
	onClick,
	variant = "default",
	size = "default",
}: TableExportButtonProp) {
	return (
		<Button variant={variant} size={size} disabled={disabled} onClick={onClick}>
			<DownloadIcon className="mr-2 h-4 w-4" />
			{buttonText}
		</Button>
	);
}
