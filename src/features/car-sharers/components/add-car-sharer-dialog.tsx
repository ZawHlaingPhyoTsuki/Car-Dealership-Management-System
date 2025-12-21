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
import AddCarSharerForm from "./add-car-sharer-form";

export default function AddCarSharerDialog() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="secondary">
					<Plus className="h-4 w-4" />
					<span className="hidden md:block">Add Shareholder</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add New Car Shareholder</DialogTitle>
					<DialogDescription>
						Enter the car shareholder details below to add it to the inventory.
					</DialogDescription>
				</DialogHeader>
				<AddCarSharerForm onClose={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}
