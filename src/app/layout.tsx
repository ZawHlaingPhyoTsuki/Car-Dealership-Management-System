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
	title: {
		default: "7hrs Automobile Management",
		template: "%s | 7hrs Automobile",
	},
	description:
		"An in-house car dealership management system for business owners and staff. Manage vehicles, track expenses, monitor employee data, and analyze business performance with secure role-based access control.",
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
