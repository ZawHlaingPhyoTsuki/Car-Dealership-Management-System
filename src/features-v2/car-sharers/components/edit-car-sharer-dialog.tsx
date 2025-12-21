"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Car } from "@/features-v2/cars/actions/get-cars";
import EditCarSharerForm from "./edit-car-sharer-form";

interface EditCarSharerDialogProps {
	car: Car;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function EditCarSharerDialog({
	car,
	open,
	onOpenChange,
}: EditCarSharerDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Edit Shareholder Information</DialogTitle>
				</DialogHeader>
				<EditCarSharerForm car={car} onClose={() => onOpenChange(false)} />
			</DialogContent>
		</Dialog>
	);
}
