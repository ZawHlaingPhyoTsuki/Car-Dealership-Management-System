import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { AppProvider } from "./provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Car Dealership Management System",
	description:
		"A fast and efficient in-house car dealership management system built with Next.js, Prisma, PostgreSQL, and ShadCN. Manage cars, employees, expenses, and business analytics with secure role-based access for admins and staff.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<AppProvider>{children}</AppProvider>
			</body>
		</html>
	);
}
