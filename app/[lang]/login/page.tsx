"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useLocale } from "@/app/hooks/useLocale";
import { login } from "@/lang/actions/login";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const lang = useLocale();
	const [isPending, startTransition] = useTransition();

	const handleSubmit = () =>
		startTransition(async () => {
			const { error } = await login(email, password, lang);
			if (error) {
				toast.error(error);
			}
		});

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="w-full max-w-md space-y-8 rounded-lg border p-8">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Welcome back</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Enter your credentials to sign in
					</p>
				</div>

				<form className="space-y-6">
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								id="email"
								name="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								placeholder="you@example.com"
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<Input
								id="password"
								name="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								placeholder="••••••••"
							/>
						</Field>
					</FieldGroup>

					<Button
						type="button"
						className="w-full"
						disabled={isPending}
						onClick={handleSubmit}
					>
						{isPending ? "Signing in..." : "Sign in"}
					</Button>

					<p className="text-center text-sm text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Link href="/register" className="font-medium underline">
							Sign up
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
