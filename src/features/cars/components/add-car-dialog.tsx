"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import AddCarForm from "./add-car-form";

export default function AddCarDialog() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="h-4 w-4" />
					Add Car
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add New Car</DialogTitle>
					<DialogDescription>
						Enter the car details below to add it to the inventory.
					</DialogDescription>
				</DialogHeader>
				<AddCarForm onClose={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}
