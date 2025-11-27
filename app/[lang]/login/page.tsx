"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { login } from "@/lang/actions/login";
import { cn } from "@/lib/utils";
import { GoogleLoginButton } from "./google-btn";
import { usePathname, useSearchParams } from "next/navigation";

export default function LoginPage(
	props: Partial<PageProps<"/[lang]/login"> & { className: string }>
) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isPending, startTransition] = useTransition();

	const pathname = usePathname();
	const searchParams = useSearchParams();
	const returnUrl = searchParams.get("returnUrl") || pathname;

	const handleSubmit = () =>
		startTransition(async () => {
			const { error } = await login(email, password, returnUrl);
			if (error) {
				toast.error(error);
				return;
			}
		});

	return (
		<div
			className={cn(
				"flex items-center justify-center min-h-[calc(100vh-68px)]",
				props.className
			)}
		>
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
					<GoogleLoginButton />
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
