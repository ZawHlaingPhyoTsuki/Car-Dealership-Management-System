"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { Button } from "@/components/ui/button";

export function ModeSwitcher() {
	const { setTheme, resolvedTheme } = useTheme();

	const toggleTheme = React.useCallback(() => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	}, [resolvedTheme, setTheme]);

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			className="rounded-full overflow-hidden cursor-pointer"
			onClick={toggleTheme}
			title="Toggle theme"
		>
			<Sun className="dark:hidden size-4" />
			<Moon className="hidden dark:block size-4" />
		</Button>
	);
}
