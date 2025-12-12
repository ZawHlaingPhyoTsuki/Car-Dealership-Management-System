"use client";

import { BarChart3, Car, DollarSign, Shield, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { paths } from "@/config/paths";

export default function Home() {
	const [throwError, setThrowError] = useState(false);

	if (throwError) {
		throw new Error("Test error to trigger ErrorBoundary");
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
				<div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-background" />
				<div className="relative mx-auto max-w-7xl">
					<div className="text-center">
						<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
							7hrs Automobile
							<span className="block text-primary">Management System</span>
						</h1>
						<p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
							Efficient internal management software for your car dealership.
							Manage inventory, track expenses, monitor employees, and analyze
							business performance—all in one secure platform.
						</p>
						<div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
							<Button size="lg" asChild>
								<Link href={paths.dashboard.root.getHref()}>
									<Zap className="mr-2 h-4 w-4" />
									Go to Dashboard
								</Link>
							</Button>
							<Button size="lg" variant="outline" asChild>
								<Link href="#features">View Features</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-7xl">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-foreground">
							System Features
						</h2>
						<p className="mt-4 text-muted-foreground">
							Everything you need to manage your dealership efficiently
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<Card>
							<CardHeader>
								<Car className="h-8 w-8 text-primary mb-2" />
								<CardTitle>Car Management</CardTitle>
								<CardDescription>
									Track inventory, sales, and vehicle details
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li>• Add, update, and remove vehicles</li>
									<li>• Mark cars as sold with buyer details</li>
									<li>• Filter by status, price, and dates</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<DollarSign className="h-8 w-8 text-primary mb-2" />
								<CardTitle>Expense Tracking</CardTitle>
								<CardDescription>
									Monitor daily business expenses
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li>• Record repair and maintenance costs</li>
									<li>• Track utility and office expenses</li>
									<li>• Categorize and filter by date</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<Users className="h-8 w-8 text-primary mb-2" />
								<CardTitle>Employee Management</CardTitle>
								<CardDescription>
									Admin-only access to staff information
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li>• Store employee details and salaries</li>
									<li>• Track employment start dates</li>
									<li>• Secure admin-only access</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<BarChart3 className="h-8 w-8 text-primary mb-2" />
								<CardTitle>Analytics Dashboard</CardTitle>
								<CardDescription>Real-time business insights</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li>• Revenue and expense summaries</li>
									<li>• Profit calculation and trends</li>
									<li>• Time-based filtering</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<Shield className="h-8 w-8 text-primary mb-2" />
								<CardTitle>Role-Based Access</CardTitle>
								<CardDescription>Secure permission management</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li>• Admin: Full system access</li>
									<li>• Staff: Limited to assigned modules</li>
									<li>• No public signup</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
				<div className="mx-auto max-w-4xl text-center">
					<h2 className="text-3xl font-bold text-foreground">
						Ready to Streamline Your Dealership?
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Get started with our efficient management system today. Secure,
						fast, and built specifically for car dealership operations.
					</p>

					<div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
						<Button size="lg" asChild>
							<Link href={paths.dashboard.root.getHref()}>
								Access Dashboard
							</Link>
						</Button>

						{/* Testing Buttons */}
						<div className="flex flex-col sm:flex-row gap-2 justify-center">
							<Button variant="outline" size="lg" asChild>
								<Link href="/non-existent-page">Test 404 Page</Link>
							</Button>
							<Button
								variant="destructive"
								size="lg"
								onClick={() => setThrowError(true)}
							>
								Test Error Boundary
							</Button>
						</div>
					</div>

					<p className="mt-4 text-sm text-muted-foreground">
						<em>Testing buttons available during development</em>
					</p>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-8 px-4 sm:px-6 lg:px-8 border-t">
				<div className="mx-auto max-w-7xl text-center text-sm text-muted-foreground">
					<p>© {new Date().getFullYear()} 7hrs Automobile Management System</p>
					<p className="mt-2">Internal use only • Role-based access control</p>
				</div>
			</footer>
		</div>
	);
}
