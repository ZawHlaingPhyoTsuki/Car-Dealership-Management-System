"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type SharerTotal = {
	sharer: string;
	totalEarned: number;
	carsInvolved: number;
};

const data: SharerTotal[] = [
	{
		sharer: "Kyaw Kyaw",
		totalEarned: 2940000,
		carsInvolved: 12,
	},
	{
		sharer: "Zaw Zaw",
		totalEarned: 1470000,
		carsInvolved: 10,
	},
	{
		sharer: "Aye Aye",
		totalEarned: 735000,
		carsInvolved: 8,
	},
	{
		sharer: "Mya Mya",
		totalEarned: 1102500,
		carsInvolved: 9,
	},
	{
		sharer: "Ko Ko",
		totalEarned: 1102500,
		carsInvolved: 7,
	},
	{
		sharer: "Hla Hla",
		totalEarned: 245000,
		carsInvolved: 3,
	},
	{
		sharer: "Mg Mg",
		totalEarned: 490000,
		carsInvolved: 5,
	},
];

const columns: ColumnDef<SharerTotal>[] = [
	{
		accessorKey: "sharer",
		header: "Sharer",
	},
	{
		accessorKey: "totalEarned",
		header: "Total Earned",
		cell: ({ row }) => (
			<span className="font-semibold text-green-600">
				{row.getValue<number>("totalEarned").toLocaleString()} THB
			</span>
		),
	},
	{
		accessorKey: "carsInvolved",
		header: "Cars Involved",
		cell: ({ row }) => (
			<Badge variant="outline">{row.getValue<number>("carsInvolved")}</Badge>
		),
	},
];

export default function SharerLifetimeSummaryPage() {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const calculateTotalEarned = () => {
		return data.reduce((sum, item) => sum + item.totalEarned, 0);
	};

	const calculateTotalCars = () => {
		return data.reduce((sum, item) => sum + item.carsInvolved, 0);
	};

	return (
		<div className="p-4 space-y-6">
			<div>
				<h1 className="text-xl font-bold mb-4">Sharer Lifetime Summary</h1>
				<p className="text-gray-600 mb-4">
					Lifetime earnings and statistics for all sharers
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="pt-6">
						<div className="text-sm text-gray-500">Total Sharers</div>
						<div className="text-3xl font-bold">{data.length}</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="text-sm text-gray-500">Total Distributed</div>
						<div className="text-3xl font-bold text-green-600">
							{calculateTotalEarned().toLocaleString()} THB
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="text-sm text-gray-500">Total Cars</div>
						<div className="text-3xl font-bold">{calculateTotalCars()}</div>
					</CardContent>
				</Card>
			</div>

			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead key={header.id}>
									{flexRender(
										header.column.columnDef.header,
										header.getContext(),
									)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No sharer data available.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			<Card>
				<CardHeader>
					<CardTitle>Top Performers</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{[...data]
							.sort((a, b) => b.totalEarned - a.totalEarned)
							.slice(0, 3)
							.map((sharer, index) => (
								<Card key={sharer.sharer}>
									<CardContent className="pt-6">
										<div className="flex items-center justify-between mb-4">
											<div className="flex items-center space-x-3">
												<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
													<span className="font-bold text-primary">
														{sharer.sharer.charAt(0)}
													</span>
												</div>
												<div>
													<div className="font-semibold">{sharer.sharer}</div>
													<div className="text-sm text-gray-500">
														Rank #{index + 1}
													</div>
												</div>
											</div>
										</div>
										<div className="space-y-2">
											<div className="flex justify-between">
												<span className="text-sm text-gray-500">
													Total Earned
												</span>
												<span className="font-semibold">
													{sharer.totalEarned.toLocaleString()} THB
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-sm text-gray-500">
													Cars Involved
												</span>
												<span className="font-semibold">
													{sharer.carsInvolved}
												</span>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
					</div>
				</CardContent>
			</Card>

			<p className="text-gray-600 mt-4">Sharer: The name of the sharer.</p>
			<p className="text-gray-600 mt-4">
				Total Earned: The total amount of money earned by the sharer.
			</p>
			<p className="text-gray-600 mt-4">
				Cars Involved: The number of cars involved in the sharer's earnings.
			</p>
		</div>
	);
}
