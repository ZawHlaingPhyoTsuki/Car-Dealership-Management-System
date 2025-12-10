"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

export const MainErrorFallback = () => {
	return (
		<div
			className="flex h-screen w-screen flex-col items-center justify-center bg-background text-destructive"
			role="alert"
		>
			<AlertTriangle className="h-16 w-16 mb-4" aria-hidden="true" />
			<h2 className="text-lg font-semibold mb-2">Oops, something went wrong</h2>
			<p className="text-sm text-muted-foreground mb-6 max-w-md text-center px-4">
				An unexpected error occurred. Please try refreshing the page.
			</p>
			<Button
				variant="default"
				onClick={() => window.location.assign(window.location.origin)}
			>
				Go to Home
			</Button>
		</div>
	);
};
