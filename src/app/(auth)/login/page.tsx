"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { paths } from "@/config/paths";
import { authClient } from "@/lib/auth-client";

export const loginSchema = z.object({
	email: z.email("Please enter a valid email."),
	password: z.string().min(6, "Password must be at least 6 characters."),
	rememberMe: z.boolean().optional(),
});
type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const [loading, setLoading] = React.useState(false);
	const [showPassword, setShowPassword] = React.useState(false);

	const form = useForm<LoginValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	});

	const onSubmit = async (values: LoginValues) => {
		setLoading(true);
		try {
			await authClient.signIn.email({
				email: values.email,
				password: values.password,
				callbackURL: paths.dashboard.root.getHref(),
				rememberMe: values.rememberMe,
				fetchOptions: {
					onRequest: () => setLoading(true),
					onSuccess: () => {
						toast.success("Login successful!");
					},
					onError: (ctx) => {
						toast.error(ctx.error.message);
					},
					onResponse: () => setLoading(false),
				},
			});
		} catch {
			toast.error("Invalid email or password.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<div className="mb-10 text-center">
				<h1 className="font-bold text-2xl">Login to your account</h1>
				<p className="text-muted-foreground text-sm">
					Enter your credentials below to access your account.
				</p>
			</div>

			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FieldSet>
					<FieldGroup className="gap-4">
						{/* Email */}
						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="email">Email</FieldLabel>
									<Input
										id="email"
										// type="email"
										placeholder="you@example.com"
										{...field}
									/>
									{fieldState.error && (
										<FieldError>{fieldState.error.message}</FieldError>
									)}
								</Field>
							)}
						/>

						{/* Password */}
						<Controller
							name="password"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<div className="relative">
										<Input
											id="password"
											type={showPassword ? "text" : "password"}
											placeholder="Your password"
											className="pr-10"
											{...field}
										/>
										<Button
											type="button"
											variant={"ghost"}
											size={"icon-sm"}
											className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
											onClick={() => setShowPassword((prev) => !prev)}
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</Button>
									</div>
									{fieldState.error && (
										<FieldError>{fieldState.error.message}</FieldError>
									)}
								</Field>
							)}
						/>

						<Field orientation="horizontal">
							{/* Remember me */}
							<Controller
								name="rememberMe"
								control={form.control}
								render={({ field }) => (
									<Field orientation="horizontal">
										<Checkbox
											id="rememberMe"
											checked={field.value}
											onCheckedChange={(v) => field.onChange(!!v)}
										/>
										<FieldLabel htmlFor="rememberMe">Remember me</FieldLabel>
									</Field>
								)}
							/>
						</Field>

						{/* Submit */}
						<Field>
							<Button type="submit" className="w-full" disabled={loading}>
								{loading ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									"Login"
								)}
							</Button>
						</Field>
					</FieldGroup>
				</FieldSet>
			</form>
		</div>
	);
}
