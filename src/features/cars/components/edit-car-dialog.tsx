"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Car } from "../actions/get-cars";
import EditCarForm from "./edit-car-form";

interface EditCarDialogProps {
	car: Car;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function EditCarDialog({
	car,
	open,
	onOpenChange,
}: EditCarDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Car</DialogTitle>
					<DialogDescription>
						Make changes to the car details here. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<EditCarForm car={car} onClose={() => onOpenChange(false)} />
			</DialogContent>
		</Dialog>
	);
}
