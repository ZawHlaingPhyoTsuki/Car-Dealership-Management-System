"use client";

import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { paths } from "@/config/paths";

export default function NotFoundPage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
			<div className="text-center max-w-2xl mx-auto">
				{/* Animated number */}
				<div className="relative mb-8">
					<span className="text-[150px] font-bold text-muted-foreground/20 leading-none">
						404
					</span>
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="text-[150px] font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent leading-none">
							404
						</span>
					</div>
				</div>

				<h1 className="text-4xl font-bold text-foreground mb-4">
					Page Not Found
				</h1>

				<p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
					Oops! The page you're looking for seems to have wandered off into the
					digital void. Let's get you back on track.
				</p>

				<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
					<Link
						className={buttonVariants({ size: "lg" })}
						href={paths.home.getHref()}
						replace
					>
						<Home className="mr-2 h-4 w-4" />
						Back to Homepage
					</Link>

					<Button
						variant="outline"
						size="lg"
						onClick={() => window.history.back()}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Go Back
					</Button>
				</div>
			</div>
		</div>
	);
}
