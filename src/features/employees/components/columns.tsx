"use client";

import type { ColumnDef } from "@tanstack/react-table";
import * as z from "zod";

export const EmployeeSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	position: z.string(),
	phone: z.string(),
	address: z.string(),
	salary: z.number(),
	startDate: z.date(),
});

export type Employee = z.infer<typeof EmployeeSchema>;

export const columns: ColumnDef<Employee>[] = [
	{
		id: "index",
		header: "No.",
		cell: ({ row }) => row.index + 1,
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => row.original.name,
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => row.original.email,
	},
	{
		accessorKey: "position",
		header: "Position",
		cell: ({ row }) => row.original.position,
	},
	{
		accessorKey: "phone",
		header: "Phone",
		cell: ({ row }) => row.original.phone,
	},
	{
		accessorKey: "address",
		header: "Address",
		cell: ({ row }) => row.original.address,
	},
	{
		accessorKey: "salary",
		header: "Salary",
		cell: ({ row }) => {
			const salary = row.original.salary;
			return new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
				minimumFractionDigits: 0,
			}).format(salary);
		},
	},
	{
		accessorKey: "startDate",
		header: "Start Date",
		cell: ({ row }) => {
			const date = row.original.startDate;
			return date ? date.toLocaleDateString("en-US") : "N/A";
		},
	},
];
