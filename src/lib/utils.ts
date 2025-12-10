import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getAvatarFallbackName(name: string): string {
	return name.charAt(0).toUpperCase() + name.charAt(1).toUpperCase();
}
